# frozen_string_literal: true

module PlaylistsHelper
  def build_act_list(playlist)
    act_list = []
    playlist[:items].each do |episode|
      broadcast_event = episode[:broadcastEvent].first
      act_list << broadcast_event[:misc][:actList] if broadcast_event
    end

    act_list.flatten.map { |act| act[:name] }.uniq
  end

  def fetch_episode_data(playlist_item:, force_fetch: false)
    if playlist_item.has_cached_json? && !force_fetch
      playlist_item.cached_json
    else
      playlist_item.fetch_data
    end
  end

  def fetch_broadcast_event(episode_id)
    client = DlabApiClient.new
    res = client.broadcast_event_from_episode_id(episode_id)

    res[:result]
  end

  def fetch_unique_actors(playlist)
    actors =
      playlist.playlist_items.map do |playlist_item|
        episode_data = fetch_episode_data(playlist_item: playlist_item, force_fetch: true)
        episode_data[:actors]
      end.flatten

    actors.uniq do |actor|
      actor[:person][:name]
    end
  end

  # rubocop:disable Metrics/AbcSize
  def fetch_unique_contributors(playlist)
    contributors = playlist.playlist_items.map do |playlist_item|
      episode_data = fetch_episode_data(playlist_item: playlist_item, force_fetch: true)
      episode_data[:contributors]
    end.flatten

    person_array = contributors.select { |contributor| contributor[:person].present? }
    organization_array = contributors.select { |contributor| contributor[:organization].present? }

    person_array.uniq { |person| person[:person][:name] } + organization_array.uniq { |org| org[:organization][:name] }
  end
  # rubocop:enable Metrics/AbcSize
end
