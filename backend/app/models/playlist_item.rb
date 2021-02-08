# frozen_string_literal: true

class PlaylistItem < ApplicationRecord
  CACHED_DATA_TTL = 1.week

  extend FriendlyId
  friendly_id :episode_id

  belongs_to :playlist
  counter_culture :playlist
  counter_culture :playlist, column_name: 'total_time', delta_column: 'duration'
  acts_as_list scope: :playlist

  serialize :cached_data, JSON

  ALLOWED_CONTEXT = %i[TVEpisode].freeze
  enum context: ALLOWED_CONTEXT.each_with_object({}) { |s, h| h[s] = s.to_s }

  # TOOD: リストにエピソード以外が入るようになったとき、context の設定をタイプごとに切り替えられるようにする
  before_save :set_item_context_and_id

  def cached_json
    cached_data.deep_symbolize_keys if has_cached_json?
  end

  def has_cached_json?
    cached_data_at.present? && (cached_data_at + CACHED_DATA_TTL).future?
  end

  def fetch_data
    client = DlabApiClient.new
    res = client.episode(type: 'tv', episode_id: episode_id)
    # BroadcastEvent, videos が大きすぎて、MySQL のカラムにデータがすべて入らないため、削除
    self.cached_data = res.reject { |key| %i[broadcastEvent videos].include?(key) }
    self.cached_data_at = Time.current

    set_duration(res)

    save

    res
  end

  private

  def set_item_context_and_id
    return if context.present? && item_id.present?

    self.context = 'TVEpisode'
    self.item_id = episode_id
  end

  def set_duration(data)
    start_date = Time.parse(data.dig(:releasedEvent, :startDate))
    end_date = Time.parse(data.dig(:releasedEvent, :endDate))

    self.duration = end_date - start_date
  end
end
