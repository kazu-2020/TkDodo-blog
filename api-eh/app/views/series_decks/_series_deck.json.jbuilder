json.id series_deck.id
json.name series_deck.name
json.description series_deck.description
json.interfix series_deck.interfix
json.playlistCount series_deck.series_playlists.select(&:active?).count
json.adminMemo series_deck.admin_memo
json.apiState series_deck.api_state
json.playlists do
  json.array! series_deck.series_playlists.select(&:active?), partial: 'series_decks/simple_playlist', as: :playlist
end
json.dateCreated series_deck.created_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
json.dateModified series_deck.updated_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
