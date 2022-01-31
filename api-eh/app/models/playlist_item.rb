# frozen_string_literal: true

class PlaylistItem < ApplicationRecord
  CACHED_DATA_TTL = 3.hours

  include Discard::Model
  extend FriendlyId
  friendly_id :episode_id

  belongs_to :playlist, optional: true, touch: true
  acts_as_list scope: :playlist

  ALLOWED_CONTEXT = %i[TVEpisode].freeze
  enum context: ALLOWED_CONTEXT.each_with_object({}) { |s, h| h[s] = s.to_s }

  # TOOD: リストにエピソード以外が入るようになったとき、context の設定をタイプごとに切り替えられるようにする
  before_save :set_item_context_and_id

  scope :playable, -> { where(has_video: true) }

  def episode_data(force_fetch: false)
    bundle_res = fetch_bundle_data(force_fetch: force_fetch)
    episode_res = bundle_res[:tvepisode][:result][0]

    episode_res.deep_symbolize_keys
  end

  def fetch_bundle_data(force_fetch: false)
    cache_key = "#{cache_key_with_version}/fetch_bundle_data"
    Rails.cache.fetch(cache_key, expires_in: CACHED_DATA_TTL, force: force_fetch) do
      DlabApiClient.new.episode_l_bundle(type: 'tv', episode_id: episode_id)
    end
  end

  def duration
    data = episode_data
    return if data.dig(:releasedEvent, :startDate).nil? || data.dig(:releasedEvent, :endDate).nil?

    start_date = Time.parse(data.dig(:releasedEvent, :startDate))
    end_date = Time.parse(data.dig(:releasedEvent, :endDate))

    end_date - start_date
  end

  def has_video
    bundle_res = fetch_bundle_data
    bundle_res[:videos].find do |video|
      video.dig(:identifierGroup, :environmentId) == 'okushibu' &&
        video.dig(:detailedContentStatus, :contentStatus) == 'ready'
    end.present?
  end

  def has_how_to
    bundle_res = fetch_bundle_data
    (bundle_res[:howto]&.[](:count) || 0).positive?
  end

  def has_event
    bundle_res = fetch_bundle_data
    (bundle_res[:event]&.[](:count) || 0).positive?
  end

  def has_faq_page
    bundle_res = fetch_bundle_data
    (bundle_res[:faqpage]&.[](:count) || 0).positive?
  end

  private

  def set_item_context_and_id
    return if context.present? && item_id.present?

    self.context = 'TVEpisode'
    self.item_id = episode_id
  end
end
