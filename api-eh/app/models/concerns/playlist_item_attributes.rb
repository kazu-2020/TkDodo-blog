# frozen_string_literal: true

# Playlistからリストアイテムの情報を管理する属性を分離したモジュール
module PlaylistItemAttributes
  extend ActiveSupport::Concern
  CACHED_DATA_TTL = 3.hour

  included do
    after_save -> { force_fetch_sub_types_count(playlist_items.ids) }
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

  def playable_playlist_items_count(playlist_string_id)
    res = fetch_playable_episode_count(playlist_string_id)
    @playable_playlist_items_count ||= res
  end

  def playable_playlist_items
    @playable_playlist_items ||= playlist_items.kept.select(&:has_video)
  end

  def faq_page_count(playlist_string_id)
    res = fetch_sub_types_count(playlist_string_id: playlist_string_id)
    @faq_page_count ||= res[:faq_page_count]
  end

  def event_count(playlist_string_id)
    res = fetch_sub_types_count(playlist_string_id: playlist_string_id)
    @event_count ||= res[:event_count]
  end

  def how_to_count(playlist_string_id)
    res = fetch_sub_types_count(playlist_string_id: playlist_string_id)
    @how_to_count ||= res[:how_to_count]
  end

  private

  def fetch_sub_types_count(force: false, playlist_string_id: '')
    Rails.cache.fetch("#{cache_key_with_version}/fetch_sub_type_count", expires_in: CACHED_DATA_TTL, force: force,
                                                                        skip_nil: true) do
      client = PocApiClient.new

      result = { event_count: 0, how_to_count: 0, faq_page_count: 0 }

      data =
        begin
          client.playlist_ll_bundle(playlist_id: playlist_string_id)
        rescue PocApiClient::NotFound
          {}
        end

      result[:faq_page_count] = data.dig(:faqpage, :count) || 0
      result[:event_count] = data.dig(:event, :count) || 0
      result[:how_to_count] = data.dig(:howto, :count) || 0

      result
    end
  end

  def force_fetch_sub_types_count(playlist_items_ids)
    playlists = Playlist.where(id: playlist_items_ids)
    playlists.each do |playlist|
      fetch_sub_types_count(force: true, playlist_string_id: playlist.string_id)
    end
  end

  def fetch_playable_episode_count(playlist_string_id)
    Rails.cache.fetch("#{cache_key_with_version}/fetch_episode_count", expires_in: CACHED_DATA_TTL, force: true,
                                                                       skip_nil: true) do
      response = PocApiClient.new.available_episode_from_playlist(playlist_string_id)
      response[:count].presence || 0
    end
  end
end
