json.id deck.id
json.name deck.name
json.description deck.description
json.interfix deck.interfix
json.playlistCount deck.playlists.count
json.adminMemo deck.admin_memo
json.apiState deck.api_state
json.playlists do
  json.array! deck.playlists, partial: 'playlists/simple_playlist', as: :playlist
end
json.sameAs do
  json.array! deck.deck_same_as do |same_as|
    json.id same_as.id
    json.name same_as.name
    json.url same_as.url
  end
end
json.dateCreated deck.created_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
json.dateModified deck.updated_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
