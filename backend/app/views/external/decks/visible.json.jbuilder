# frozen_string_literal: true

json.type 'NDeck'
json.id @deck.deck_id('visible')
json.name @deck.name
json.description @deck.description

json.identifierGroup do
  json.deckUId @deck.visible_uid
  json.deckId @deck.deck_id('visible')
  json.deckName @deck.name
  json.typeOfDeck @deck.item_type
end

json.set! 'playlists' do
  json.array! @deck.playlists.each do |playlist|
    json.partial! partial: 'external/decks/playlist',
                  locals: { playlist: playlist, area: @area, deck_type: 'visible', object_type: @object_type }
  end
end

json.sameAs do
  json.array! [
    "https://www.nhk.jp/d/dk/recommend-visible-#{@area}",
    "https://dev-preview-eh.nr.nhk.jp/d/dk/recommend-visible-#{@area}"
  ]
end

json.url @request_url
