# frozen_string_literal: true

# TODO: module, concern 等に切り出す
# rubocop:disable Metrics/ClassLength
class Playlist < ApplicationRecord
  class InvalidPublishedStateTransitionError < StandardError; end
  extend FriendlyId
  include GenreMountable
  include ArticleFormattable

  friendly_id :string_id

  include LogoUploader::Attachment(:logo_image)
  include EyecatchUploader::Attachment(:eyecatch_image)
  include HeroUploader::Attachment(:hero_image)

  VALID_COLOR_REGEX = /\A#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\z/.freeze
  PUBLISHED_STATES = %i[draft waiting_for_publish published secret].freeze
  AUTHOR_TYPES = %i[Person Organization].freeze
  PUBLISHER_TYPES = AUTHOR_TYPES

  enum published_state: PUBLISHED_STATES.each_with_object({}) { |s, h| h[s] = s.to_s }

  has_many :playlist_items,
           -> { order(position: :asc) },
           dependent: :destroy
  accepts_nested_attributes_for :playlist_items, allow_destroy: true

  has_many :playlist_keywords, dependent: :destroy
  has_many :playlist_hashtags, dependent: :destroy

  has_many :article_images, dependent: :destroy
  has_one :same_as, dependent: :destroy
  accepts_nested_attributes_for :same_as, allow_destroy: true

  has_many :citations, dependent: :destroy
  accepts_nested_attributes_for :citations, allow_destroy: true

  belongs_to :deck

  scope :recent, -> { order(updated_at: :desc) }
  scope :original, -> { where('d5_playlist_id IS NULL') }
  scope :of, ->(deck) { where(deck: deck) }
  scope :has_article, -> { where('marked_body IS NOT NULL') }
  scope :no_article, -> { where('marked_body IS NULL') }
  scope :name_like, ->(query) { where('name LIKE ?', "%#{query}%") }

  validates :name, presence: true
  validates :published_state, presence: true, inclusion: { in: PUBLISHED_STATES.map(&:to_s) }
  %w[selected_palette primary_light_color primary_dark_color
     text_light_color text_dark_color link_light_color link_dark_color].each do |color_attribute|
    validates color_attribute.to_sym, format: { with: VALID_COLOR_REGEX },
                                      if: proc { |pl| pl.send(color_attribute.to_sym).present? }
  end
  validates :original_series_id, uniqueness: { case_sensitive: true }, if: :original_series_id?
  validates_uniqueness_of :alias_id, case_sensitive: false, allow_nil: true
  validates :alias_id,
            format: { with: /\A[-_a-zA-Z\d]+\z/n, allow_blank: true },
            length: { maximum: 255 }
  validates :author_type, inclusion: { in: AUTHOR_TYPES.map(&:to_s) }, allow_nil: true
  validates :publisher_type, inclusion: { in: PUBLISHER_TYPES.map(&:to_s) }, allow_nil: true
  validate :require_author_name_and_type
  validate :require_publisher_and_type

  before_create :generate_string_id
  before_create :set_default_color
  after_create :link_article_images
  before_save :generate_derivatives

  class << self
    def assign_from_series(series_id)
      playlist = new(original_series_id: series_id)

      client = DlabApiClient.new
      series_bundle = client.series_bundle(type: 'tv', series_id: series_id)

      assign_series_meta(playlist, series_bundle[:tvseries])
      assign_series_episodes(playlist, series_bundle[:tvepisode])

      playlist
    end

    private

    # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
    def assign_series_meta(playlist, series)
      playlist.name = series[:name]
      playlist.keywords = series[:keywords] if series[:keywords]
      playlist.detailed_catch = series[:detailedCatch]
      playlist.description = series[:description]
      if series[:identifierGroup]
        playlist.hashtags = series[:identifierGroup][:hashtag] if series[:identifierGroup][:hashtag]
        if series[:identifierGroup][:formatGenre]
          playlist.format_genre_code = series[:identifierGroup][:formatGenre][0][:id]
        end
        if series[:identifierGroup][:themeGenre]
          playlist.theme_genre_code = series[:identifierGroup][:themeGenre][0][:id]
        end
      end
      assign_series_color(playlist, series[:style])
      assign_series_images(playlist, series)

      playlist.build_same_as(name: series[:name], url: series[:url])
    end
    # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

    def assign_series_color(playlist, style)
      return unless style

      playlist.primary_light_color = style[:primaryLight]
      playlist.primary_dark_color = style[:primaryDark]
      playlist.link_light_color = style[:linkLight]
      playlist.link_dark_color = style[:linkDark]
      playlist.text_light_color = style[:textLight]
      playlist.text_dark_color = style[:textDark]
    end

    # rubocop:disable Metrics/AbcSize
    def assign_series_images(playlist, series)
      playlist.logo_image_remote_url = series[:logo][:main][:url] if series[:logo][:main]
      playlist.eyecatch_image_remote_url = series[:eyecatch][:main][:url] if series[:eyecatch][:main]
      playlist.hero_image_remote_url = series[:hero][:main][:url] if series[:hero][:main]
    end
    # rubocop:enable Metrics/AbcSize

    def assign_series_episodes(playlist, episodes)
      episodes.each do |episode|
        next if Time.parse(episode[:releasedEvent][:startDate] || '2099-12-31T23:59:59+09:00').future?

        playlist.playlist_items.build(episode_id: episode[:id])
      end
    end
  end

  def original_id
    "eh-#{format('%010d', id)}"
  end

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

  def browsable_item_count
    playlist_items.kept.pluck(:has_video).select { |has_video| has_video }.size
  end

  def wait_for_publish!(reserve_publish_time_at)
    raise InvalidPublishedStateTransitionError if reserve_publish_time_at.nil? || !(draft? || secret?)

    self.reserve_publish_time_at = reserve_publish_time_at
    waiting_for_publish!
  end

  def publish!(time = Time.current)
    raise InvalidPublishedStateTransitionError unless waiting_for_publish? || secret?

    self.reserve_publish_time_at = nil
    self.published_at = time unless published_at
    published!
  end

  def make_secret!
    raise InvalidPublishedStateTransitionError unless published? || waiting_for_publish?

    self.reserve_publish_time_at = nil
    secret!
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

  # rubocop:disable Metrics/AbcSize
  def article_contains_episodes
    return [] unless editor_data.present?

    episode_ids = editor_data['blocks'].select { |block| block['type'] == 'multiTypeEpisode' }
                                       .map { |block| block['data']['episodeId'] }
    client = DlabApiClient.new
    episode_ids.map do |episode_id|
      client.episode_bundle(type: 'tv', episode_id: episode_id)[:tvepisode][0]
    rescue DlabApiBase::NotFound, NoMethodError
      nil
    end.flatten.compact
  end
  # rubocop:enable Metrics/AbcSize

  def deck_ids
    return [] unless deck.present?

    ids = [deck.deck_id('visible')]
    ids << deck.deck_id('editorial') if has_article?
    ids
  end

  def update_playable_total_time!
    self.playable_total_time = playlist_items.playable.sum(&:duration)
    save!
  end

  def update_playable_playlist_items_count!
    self.playable_playlist_items_count = playlist_items.playable.size
    save!
  end

  # rubocop: disable Metrics/CyclomaticComplexity, Metrics/AbcSize
  def bundle
    result = {
      tvepisode: [],
      event: [],
      howto: []
    }

    client = DlabApiClient.new
    playlist_items.each do |item|
      data = client.episode_bundle(type: 'tv', episode_id: item.episode_id)

      result[:tvepisode] << data[:tvepisode][0] if data[:tvepisode] && !data[:tvepisode].empty?
      result[:event] += data[:event] if data[:event] && !data[:event].empty?
      result[:howto] += data[:howto] if data[:howto] && !data[:howto].empty?
    end
    result
  end
  # rubocop: enable Metrics/CyclomaticComplexity, Metrics/AbcSize

  private

  def generate_string_id
    self.string_id = SecureRandom.uuid
  end

  # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity
  def set_default_color
    self.selected_palette    = '#ffffff' if selected_palette.nil?
    self.primary_light_color = '#757575' if primary_light_color.nil?
    self.primary_dark_color  = '#999999' if primary_dark_color.nil?
    self.text_light_color    = '#000000' if text_light_color.nil?
    self.text_dark_color     = '#ffffff' if text_dark_color.nil?
    self.link_light_color    = '#000000' if link_light_color.nil?
    self.link_dark_color     = '#ffffff' if link_dark_color.nil?
  end
  # rubocop:enable Metrics/AbcSize, Metrics/CyclomaticComplexity

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

  # rubocop:disable Metrics/AbcSize
  def link_article_images
    return if editor_data.blank?

    image_urls = editor_data['blocks'].select { |block| block['type'] == 'image' }
                                      .map { |block| block['data']['file']['url'] }
                                      .map { |url| URI.parse(url) }
    image_names = image_urls.map { |uri| File.basename(uri.path)  }

    image_names.each do |image_name|
      article_image = ArticleImage.find_by(image_id: image_name)
      article_image.playlist_id = id
      article_image.save
    end
  end
  # rubocop:enable Metrics/AbcSize
end
# rubocop:enable Metrics/ClassLength
