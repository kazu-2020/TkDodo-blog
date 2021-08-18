# frozen_string_literal: true

json.type 'NDeck'
json.id @deck.deck_id('editorial')
json.name @deck.name
json.description @deck.description

json.identifierGroup do
  json.deckUId @deck.editorial_uid
  json.deckId @deck.deck_id('editorial')
  json.deckName @deck.name
  json.typeOfDeck @deck.item_type
end

json.playlists []

json.sameAs do
  json.array! [
    "https://www.nhk.jp/d/dk/recommend-radio-#{@area}#{@deck.is_r5? ? '-r5' : ''}",
    "https://dev-preview-eh.nr.nhk.jp/d/dk/recommend-radio-#{@area}#{@deck.is_r5? ? '-r5' : ''}"
  ]
end

json.url @request_url
