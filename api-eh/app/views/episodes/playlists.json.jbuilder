# frozen_string_literal: true

json.playlists do
  json.array! @playlists, partial: 'simple_playlist', as: :playlist
end
