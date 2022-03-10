json.id series_deck.id
json.name series_deck.name
json.description series_deck.description
json.interfix series_deck.interfix
json.playlistCount series_deck.series_playlists.select(&:active?).count
json.adminMemo series_deck.admin_memo
json.playlists do
  json.array! series_deck.series_playlists.select(&:active?), partial: 'series_decks/simple_playlist', as: :playlist
end
# json.sameAs do
#   json.array! series_deck.deck_same_as do |same_as|
#     json.id same_as.id
#     json.name same_as.name
#     json.url same_as.url
#   end
# end
json.dateCreated series_deck.created_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
json.dateModified series_deck.updated_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
