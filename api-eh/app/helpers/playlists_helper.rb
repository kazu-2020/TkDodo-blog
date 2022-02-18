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

  def fetch_unique_actors(playlist)
    actors =
      playlist.playlist_items.kept.map do |playlist_item|
        playlist_item.episode_data[:actors]
      end.flatten

    actors.uniq do |actor|
      actor[:person][:name]
    end
  end

  # rubocop:disable Metrics/AbcSize
  def fetch_unique_contributors(playlist)
    contributors = playlist.playlist_items.kept.map do |playlist_item|
      playlist_item.episode_data[:contributors]
    end.flatten

    person_array = contributors.select { |contributor| contributor[:person].present? }
    organization_array = contributors.select { |contributor| contributor[:organization].present? }

    person_array.uniq { |person| person[:person][:name] } + organization_array.uniq { |org| org[:organization][:name] }
  end
  # rubocop:enable Metrics/AbcSize
end
