# frozen_string_literal: true

# Playlistからリストアイテムの情報を管理する属性を分離したモジュール
module PlaylistItemAttributes
  extend ActiveSupport::Concern
  CACHED_DATA_TTL = 3.hour

  included do
    after_save :force_fetch_sub_types_count
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
    @playable_playlist_items_count ||= playable_playlist_items&.size
  end

  def playable_playlist_items
    @playable_playlist_items ||= playlist_items.kept.select(&:has_video)
  end

  def browsable_item_count
    playable_playlist_items_count
  end

  def faq_page_count
    res = fetch_sub_types_count
    @faq_page_count ||= res[:faq_page_count]
  end

  def event_count
    res = fetch_sub_types_count
    @event_count ||= res[:event_count]
  end

  def how_to_count
    res = fetch_sub_types_count
    @how_to_count ||= res[:how_to_count]
  end

  private

  def fetch_sub_types_count(force: false) # rubocop:disable Metrics/MethodLength
    Rails.cache.fetch("#{cache_key_with_version}/fetch_sub_type_count", expires_in: CACHED_DATA_TTL, force: force,
                                                                        skip_nil: true) do
      client = DlabApiClient.new

      result = { event_count: 0, how_to_count: 0, faq_page_count: 0 }

      playlist_items.each do |item|
        data =
          begin
            client.episode_list_bundle(type: 'tv', episode_id: item.episode_id)
          rescue DlabApiClient::NotFound
            {}
          end

        result[:faq_page_count] += data.dig(:faqpage, :count) || 0
        result[:event_count] += data.dig(:event, :count) || 0
        result[:how_to_count] += data.dig(:howto, :count) || 0
      end

      result
    end
  end

  def force_fetch_sub_types_count
    fetch_sub_types_count(force: true)
  end
end
