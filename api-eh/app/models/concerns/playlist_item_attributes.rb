# frozen_string_literal: true

# Playlistからリストアイテムの情報を管理する属性を分離したモジュール
module PlaylistItemAttributes
  extend ActiveSupport::Concern
  CACHED_DATA_TTL = 3.hour
  SUB_TYPES = %i[tvepisode event howto faqpage recipe].freeze

  included do
    after_save -> { fetch_sub_types_count(force: true) }
  end

  def total_time
    @total_time ||= playlist_items.kept.map(&:duration)&.sum
  end

  def playlist_items_count
    @playlist_items_count ||= playlist_items.kept.size
  end

  def playable_total_time
    @playable_total_time ||= playable_playlist_items.map(&:duration)&.sum
  end

  def playable_playlist_items_count
    res = fetch_playable_episode_count
    @playable_playlist_items_count ||= res
  end

  def playable_playlist_items
    @playable_playlist_items ||= playlist_items.kept.select(&:has_video)
  end

  def faqpage_count
    res = fetch_sub_types_count
    @faqpage_count ||= res[:faqpage_count]
  end

  def event_count
    res = fetch_sub_types_count
    @event_count ||= res[:event_count]
  end

  def howto_count
    res = fetch_sub_types_count
    @howto_count ||= res[:howto_count]
  end

  def tvepisode_count
    res = fetch_sub_types_count
    @tvepisode_count ||= res[:tvepisode_count]
  end

  def recipe_count
    res = fetch_sub_types_count
    @recipe_count ||= res[:recipe_count]
  end

  def fetch_sub_types_count(force: false)
    Rails.cache.fetch("#{cache_key_with_version}/fetch_sub_type_count", expires_in: CACHED_DATA_TTL, force: force,
                                                                        skip_nil: true) do
      client = PocApiClient.new

      result = {}

      data =
        begin
          client.playlist_ll_bundle(playlist_id: string_id)
        rescue PocApiClient::NotFound
          {}
        end

      SUB_TYPES.each do |sub_type|
        result["#{sub_type}_count"] = data.dig(sub_type, :count) || 0
      end

      result.symbolize_keys
    end
  end

  private

  def fetch_playable_episode_count
    Rails.cache.fetch("#{cache_key_with_version}/fetch_episode_count", expires_in: CACHED_DATA_TTL, force: true,
                                                                       skip_nil: true) do
      response = PocApiClient.new.available_episode_from_playlist(string_id)
      response[:count].presence || 0
    end
  end
end
