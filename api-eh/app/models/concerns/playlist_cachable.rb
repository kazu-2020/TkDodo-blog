# frozen_string_literal: true

module PlaylistCachable
  extend ActiveSupport::Concern
  CACHED_DATA_TTL = 3.hour

  included do # rubocop:disable Metrics/BlockLength
    def total_time
      Rails.cache.fetch("#{cache_key_with_version}/total_time", expires_in: CACHED_DATA_TTL) do
        playlist_items.kept.map(&:duration).sum
      end
    end

    def playlist_items_count
      Rails.cache.fetch("#{cache_key_with_version}/playlist_items_count", expires_in: CACHED_DATA_TTL) do
        playlist_items.kept.size
      end
    end

    def playable_total_time
      Rails.cache.fetch("#{cache_key_with_version}/playable_total_time", expires_in: CACHED_DATA_TTL) do
        playlist_items.kept.playable.map(&:duration).sum
      end
    end

    def playable_playlist_items_count
      Rails.cache.fetch("#{cache_key_with_version}/playable_playlist_items_count", expires_in: CACHED_DATA_TTL) do
        playlist_items.kept.playable.size
      end
    end

    def faq_page_count
      sub_types_count[:faq_page_count]
    end

    def event_count
      sub_types_count[:event_count]
    end

    def how_to_count
      sub_types_count[:how_to_count]
    end

    def sub_types_count
      Rails.cache.fetch("#{cache_key_with_version}/sub_type_count", expires_in: CACHED_DATA_TTL) do
        fetch_sub_type_count
      end
    end

    private

    def fetch_sub_type_count
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
end
