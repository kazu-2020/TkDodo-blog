json.episodes do
  json.array! @series_playlist.episodes[:result] do |episode|
    json.partial! partial: 'series_playlists/episode', locals: { episode: episode }
  end
end
