# frozen_string_literal: true

# TODO: module, concern 等に切り出す
class Playlist < ApplicationRecord # rubocop:disable Metrics/ClassLength
  extend FriendlyId
  include GenreMountable
  include ArticleFormattable
  include ApiStatable
  include PlaylistItemAttributes

  friendly_id :string_uid

  include LogoUploader::Attachment(:logo_image)
  include EyecatchUploader::Attachment(:eyecatch_image)
  include HeroUploader::Attachment(:hero_image)

  VALID_COLOR_REGEX = /\A#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\z/.freeze
  AUTHOR_TYPES = %i[Person Organization].freeze
  PUBLISHER_TYPES = AUTHOR_TYPES
  PUBLISH_LEVELS = %i[notyet ready limited gone full].freeze

  enum publish_level: PUBLISH_LEVELS.each_with_object({}) { |s, h| h[s] = s.to_s }

  has_many :playlist_items,
           -> { order(position: :asc) },
           dependent: :destroy
  accepts_nested_attributes_for :playlist_items, allow_destroy: true

  has_many :deck_playlists, -> { order(position: :asc) }
  has_many :decks, through: :deck_playlists

  has_many :playlist_keywords, dependent: :destroy
  has_many :playlist_hashtags, dependent: :destroy

  has_many :article_images, dependent: :destroy
  has_many :same_as, dependent: :destroy
  accepts_nested_attributes_for :same_as, allow_destroy: true

  has_many :citations, dependent: :destroy
  accepts_nested_attributes_for :citations, allow_destroy: true

  scope :recent, -> { order(updated_at: :desc) }
  scope :original, -> { where('d5_playlist_id IS NULL') }
  scope :has_article, -> { where('marked_body IS NOT NULL') }
  scope :no_article, -> { where('marked_body IS NULL') }
  scope :name_like, ->(query) { where('name LIKE ?', "%#{query}%") }

  validates :name, presence: true
  %w[selected_palette primary_light_color primary_dark_color
     text_light_color text_dark_color link_light_color link_dark_color].each do |color_attribute|
    validates color_attribute.to_sym, format: { with: VALID_COLOR_REGEX },
                                      if: proc { |pl| pl.send(color_attribute.to_sym).present? }
  end
  validates_uniqueness_of :alias_id, case_sensitive: false, allow_nil: true
  validates :alias_id,
            format: { with: /\A[-_a-zA-Z\d]+\z/n, allow_blank: true },
            length: { maximum: 255 }
  validates :author_type, inclusion: { in: AUTHOR_TYPES.map(&:to_s) }, allow_nil: true
  validates :publisher_type, inclusion: { in: PUBLISHER_TYPES.map(&:to_s) }, allow_nil: true
  validate :require_author_name_and_type
  validate :require_publisher_and_type

  before_create :generate_string_uid
  before_create :set_default_color
  after_create :link_article_images
  after_create :save_string_id
  before_save :generate_derivatives
  before_save :set_available_article
  before_save :trim_name

  def format_genre_name
    return '' unless format_genre_code

    FORMAT_GENRES[format_genre_code.to_sym]
  end

  def theme_genre_name
    return '' unless theme_genre_code

    THEME_GENRES[theme_genre_code.to_sym]
  end

  def has_article?
    marked_body.present?
  end

  def dummy_image_url(image_type)
    image_seed = created_at.day.digits.first + 1
    "https://dev-eh.nr.nhk.jp/dummy/default#{image_seed}/default#{image_seed}-#{image_type}.png"
  end

  def rebuild_episode_list_to(episodes)
    current_episodes = playlist_items.kept.pluck(:episode_id)

    ActiveRecord::Base.transaction do
      new_episode_ids = (current_episodes | episodes) - current_episodes
      add_playlist_items!(new_episode_ids)

      remove_episode_ids = (current_episodes | episodes) - episodes
      remove_playlist_items!(remove_episode_ids)

      reorder_playlist_items(episodes)
    end

    touch
  end

  def keywords
    playlist_keywords.pluck(:name)
  end

  def keywords=(new_keywords)
    add_keywords = new_keywords - (keywords & new_keywords)
    self.playlist_keywords += add_keywords.map { |keyword| PlaylistKeyword.new(name: keyword) }

    remove_keywords = keywords - (keywords & new_keywords)
    remove_keywords.each do |remove_keyword|
      playlist_keywords.find_by(name: remove_keyword).destroy
    end
  end

  def hashtags
    playlist_hashtags.pluck(:name)
  end

  def hashtags=(new_hashtags)
    add_hashtags = new_hashtags - (hashtags & new_hashtags)
    self.playlist_hashtags += add_hashtags.map { |hashtag| PlaylistHashtag.new(name: hashtag) }

    remove_hashtags = hashtags - (hashtags & new_hashtags)
    remove_hashtags.each do |remove_hashtag|
      playlist_hashtags.find_by(name: remove_hashtag).destroy
    end
  end

  def article_contains_episodes
    return [] unless editor_data.present?

    episode_ids = editor_blocks_of('multiTypeEpisode').map { |block| block['data']['episodeId'] }
    client = DlabApiClient.new
    episode_ids.map do |episode_id|
      client.episode_l_bundle(type: 'tv', episode_id: episode_id)[:tvepisode][:result][0]
    rescue DlabApiBase::NotFound, NoMethodError
      nil
    end.flatten.compact
  end

  def replace_article_body_urls
    editor_data_text = editor_data.to_json.to_s
    editor_data_text.gsub!('psychic-eureka-90cdb0a4.pages.github.io', 'dev-www-eh.nr.nhk.jp')

    self.editor_data = JSON.parse(editor_data_text)

    save
  end

  def refresh_article_body_episode_data # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/PerceivedComplexity, Metrics/CyclomaticComplexity
    return if editor_data&.[]('blocks').nil?

    client = DlabApiClient.new

    editor_data['blocks'] = editor_data['blocks'].map do |block|
      next block if block['type'] != 'multiTypeEpisode'

      episode_id = block['data']['episodeId']
      data =
        begin
          client.episode_l_bundle(type: 'tv', episode_id: episode_id)
        rescue DlabApiClient::NotFound
          {}
        end
      episode = data&.[](:tvepisode)&.[](:result)&.[](0)
      block['data']['episode']['eyecatch'] = episode[:eyecatch] || episode[:partOfSeries][:eyecatch] if episode.present?
      block
    end
    editor_data
  end

  def save_string_id
    self.string_id = "recommend-tep-#{format('%010d', id)}"
    save
  end

  def set_available_article
    self.available_acticle = has_article?
  end

  # @param [String] type blockのtypeの文字列
  # @return [Array] blocksの中からtypeのブロックを抽出した配列
  def editor_blocks_of(type)
    return [] if editor_data.blank?

    editor_data['blocks'].select { |block| block['type'] == type }
  end

  private

  def trim_name
    self.name = name.gsub(/(^[[:space:]]+)|([[:space:]]+$)/, '')
  end

  def generate_string_uid
    self.string_uid = SecureRandom.uuid
  end

  def set_default_color # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity
    self.selected_palette = '#ffffff' if selected_palette.nil?
    self.primary_light_color = '#757575' if primary_light_color.nil?
    self.primary_dark_color = '#999999' if primary_dark_color.nil?
    self.text_light_color = '#000000' if text_light_color.nil?
    self.text_dark_color = '#ffffff' if text_dark_color.nil?
    self.link_light_color = '#000000' if link_light_color.nil?
    self.link_dark_color = '#ffffff' if link_dark_color.nil?
  end

  def add_playlist_items!(episode_ids)
    episode_ids.each do |episode_id|
      playlist_items.create!(episode_id: episode_id)
    end
  end

  def remove_playlist_items!(episode_ids)
    episode_ids.each do |episode_id|
      playlist_items.kept.find_by(episode_id: episode_id).destroy!
    end
  end

  def reorder_playlist_items(new_episode_order)
    new_episode_order.each_with_index do |episode, i|
      next if episode == reload.playlist_items[i].episode_id

      sort_target_episode = playlist_items.kept.find_by(episode_id: episode)
      sort_target_episode.set_list_position(i + 1)
    end
  end

  def generate_derivatives
    logo_image_derivatives! if will_save_change_to_logo_image_data? && logo_image.present?
    eyecatch_image_derivatives! if will_save_change_to_eyecatch_image_data? && eyecatch_image.present?
    hero_image_derivatives! if will_save_change_to_hero_image_data? && hero_image.present?
  end

  def require_author_name_and_type
    if author_type.present?
      errors.add(:author_name, 'は必須です') unless author_name.present?
    elsif author_name.present?
      errors.add(:author_type, 'は必須です') unless author_type.present?
    end
  end

  def require_publisher_and_type
    if publisher_type.present?
      errors.add(:publisher_name, 'は必須です') unless publisher_name.present?
    elsif publisher_name.present?
      errors.add(:publisher_type, 'は必須です') unless publisher_type.present?
    end
  end

  def link_article_images
    return if editor_data.blank?

    image_urls = editor_blocks_of('image')
                 .map { |block| URI.parse(block['data']['file']['url']) }
    image_names = image_urls.map(&:path)

    image_names.each do |image_name|
      article_image = ArticleImage.find_by(image_id: image_name)
      article_image.playlist_id = id
      article_image.save
    end
  end
end
