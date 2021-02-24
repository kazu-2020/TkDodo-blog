# frozen_string_literal: true

json.items @playlist.playlist_items.kept do |playlist_item|
  json.partial! partial: 'shared/episode', locals: { episode: playlist_item }
end
