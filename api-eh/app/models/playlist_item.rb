# frozen_string_literal: true

class PlaylistItem < ApplicationRecord
  CACHED_DATA_TTL = 1.week

  include Discard::Model
  extend FriendlyId
  friendly_id :episode_id

  belongs_to :playlist, optional: true
  counter_culture :playlist
  counter_culture :playlist, column_name: 'total_time', delta_column: 'duration'
  acts_as_list scope: :playlist

  serialize :cached_data, JSON

  ALLOWED_CONTEXT = %i[TVEpisode].freeze
  enum context: ALLOWED_CONTEXT.each_with_object({}) { |s, h| h[s] = s.to_s }

  # TOOD: リストにエピソード以外が入るようになったとき、context の設定をタイプごとに切り替えられるようにする
  before_save :set_item_context_and_id

  scope :playable, -> { where(has_video: true) }

  def cached_json
    cached_data.deep_symbolize_keys if has_cached_json?
  end

  def has_cached_json?
    cached_data_at.present? && (cached_data_at + CACHED_DATA_TTL).future?
  end

  # rubocop: disable Metrics/AbcSize, Metrics/CyclomaticComplexity
  def fetch_data
    client = DlabApiClient.new
    bundle_res = client.episode_l_bundle(type: 'tv', episode_id: episode_id)
    episode_res = bundle_res[:tvepisode][:result][0]

    # BroadcastEvent, videos が大きすぎて、MySQL のカラムにデータがすべて入らないため、削除
    self.cached_data = episode_res.reject { |key| %i[broadcastEvent videos].include?(key) }
    self.cached_data_at = Time.current

    set_duration(episode_res)
    set_has_video(episode_res)

    self.has_how_to = (bundle_res[:howto]&.[](:count) || 0).positive?
    self.has_event = (bundle_res[:event]&.[](:count) || 0).positive?
    self.has_faq_page = (bundle_res[:faqpage]&.[](:count) || 0).positive?

    save

    episode_res
  end
  # rubocop: enable Metrics/AbcSize, Metrics/CyclomaticComplexity

  private

  def set_item_context_and_id
    return if context.present? && item_id.present?

    self.context = 'TVEpisode'
    self.item_id = episode_id
  end

  def set_duration(data)
    return if data.dig(:releasedEvent, :startDate).nil? || data.dig(:releasedEvent, :endDate).nil?

    start_date = Time.parse(data.dig(:releasedEvent, :startDate))
    end_date = Time.parse(data.dig(:releasedEvent, :endDate))

    self.duration = end_date - start_date
  end

  def set_has_video(data)
    self.has_video = data[:videos].find do |video|
      video.dig(:identifierGroup, :environmentId) == 'okushibu' &&
        video.dig(:detailedContentStatus, :contentStatus) == 'ready'
    end.present?
  end
end
