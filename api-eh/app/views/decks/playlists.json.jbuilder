json.playlists do
  json.array! @playlists, partial: 'playlists/playlist', as: :playlist
end

json.partial! 'shared/pagination', record: @playlists
