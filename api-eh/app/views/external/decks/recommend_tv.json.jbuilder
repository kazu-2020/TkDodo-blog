# frozen_string_literal: true

json.type 'NDeck'
json.id @deck.deck_id('tv')
json.name @deck.name
json.description @deck.description

json.identifierGroup do
  json.deckUId @deck.visible_uid
  json.deckId @deck.deck_id('tv')
  json.deckName @deck.name
  json.typeOfDeck @deck.item_type
end

url_params = params.permit(:area, :type, :mediaAction, :order, :orderBy)
                   .merge(itemOffset: @item_offset, itemSize: @item_size, size: @size, offset: @offset).to_param
json.playlistUrl "#{external_playlists_url(deck_id: deck_id)}.json?#{url_params.to_param}"

json.sameAs do
  json.array! [
    "https://www.nhk.jp/d/dk/recommend-tv-#{@area}",
    "https://dev-preview-eh.nr.nhk.jp/d/dk/recommend-tv-#{@area}"
  ]
end

json.url @request_url
