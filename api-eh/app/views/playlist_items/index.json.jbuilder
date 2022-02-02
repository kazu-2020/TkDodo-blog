# frozen_string_literal: true

json.items do
  json.array! @playlist_items do |playlist_item|
    json.partial! partial: 'shared/episode', locals: { episode: playlist_item }
  end
end
