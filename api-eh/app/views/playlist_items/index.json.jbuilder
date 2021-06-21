# frozen_string_literal: true

json.items do
  json.array! @playlist.playlist_items.kept do |playlist_item|
    json.partial! partial: 'shared/episode', locals: { episode: playlist_item }
  end
end
