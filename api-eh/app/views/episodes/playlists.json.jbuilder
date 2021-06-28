# frozen_string_literal: true

json.playlists do
  json.array! @playlists, partial: 'playlists/simple_playlist', as: :playlist
end
