# frozen_string_literal: true

episodes = @playlist.output_item_list_to_bundle && @playlist.output_episode_to_bundle ? 'tvepisode' : nil

if episodes.present?
  json.tvepisode do
    json.count @playlist.playlist_items.count
  end
end
