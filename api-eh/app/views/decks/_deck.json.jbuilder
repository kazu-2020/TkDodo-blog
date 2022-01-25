json.id deck.id
json.name deck.name
json.totalTime deck.total_time
json.playlistCount deck.playlists.count
json.label '東京'
json.playlists do
  json.array! deck.playlists, partial: 'playlists/simple_playlist', as: :playlist
end
json.dateCreated deck.created_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
json.dateModified deck.updated_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
