# frozen_string_literal: true

# PlaylistItem (Episode) のメタ情報はEditorialHandsでは永続化せず、キャッシュを活用しつつAPIのレスポンスを利用します。
class PlaylistItem < ApplicationRecord
  CACHED_DATA_TTL = 3.hours

  include Discard::Model
  extend FriendlyId
  friendly_id :episode_id

  belongs_to :playlist, optional: true, touch: true
  acts_as_list scope: :playlist

  ALLOWED_CONTEXT = %i[TVEpisode].freeze
  enum context: ALLOWED_CONTEXT.each_with_object({}) { |s, h| h[s] = s.to_s }

  # NOTE: リストにエピソード以外が入るようになったとき、context の設定をタイプごとに切り替えられるようにする
  before_save :set_item_context_and_id

  def episode_data(force_fetch: false)
    bundle_res = fetch_bundle_data(force_fetch: force_fetch)
    episode_res = bundle_res[:tvepisode][:result][0]

    episode_res&.deep_symbolize_keys
  end

  def fetch_bundle_data(force_fetch: false)
    cache_key = "#{cache_key_with_version}/fetch_bundle_data/#{episode_id}"
    Rails.cache.fetch(cache_key, expires_in: CACHED_DATA_TTL, force: force_fetch, skip_nil: true) do
      DlabApiClient.new.episode_l_bundle(type: 'tv', episode_id: episode_id)
    end
  end

  def fetch_episode_videos_data(force_fetch: false)
    cache_key = "#{cache_key_with_version}/fetch_episode_data/#{episode_id}"
    fetched_episode_data = Rails.cache.fetch(cache_key, expires_in: CACHED_DATA_TTL,
                                                        force: force_fetch,
                                                        skip_nil: true) do
      res = DlabApiClient.new.episode(type: 'tv', episode_id: episode_id)
      res&.deep_symbolize_keys
    end

    fetched_episode_data[:videos]
  rescue => e
    Rails.logger.error("#{e.class} (#{e.message}):\n  #{e.backtrace.join("\n  ")}")
    []
  end

  def duration
    episode_res = episode_data
    return 0 if episode_res.blank?
    return 0 if episode_res.dig(:releasedEvent, :startDate).nil? || episode_res.dig(:releasedEvent, :endDate).nil?

    start_date = Time.parse(episode_res.dig(:releasedEvent, :startDate))
    end_date = Time.parse(episode_res.dig(:releasedEvent, :endDate))

    end_date - start_date
  end

  # 20220727時点でプレイリスト検索がr6.0 にしかないので、r7 ができるまでokushibu3も参照しています
  # 社会実証2期に向けてVideoObjectの参照先を変更する場合修正が必要になることに注意してください
  # https://github.com/d7lab/aw-editorialhands/issues/1365
  def has_video
    episode_res = episode_data
    return false if episode_res&.dig(:videos).blank?

    episode_res[:videos].find do |video|
      (video.dig(:detailedContentStatus, :environmentId) == 'okushibu' ||
       video.dig(:detailedContentStatus, :environmentId) == 'okushibu3') &&
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
