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

json.set! 'playlists' do
  json.array! @deck.playlists.has_article.each do |playlist|
    json.partial! partial: 'external/decks/playlist', locals: { playlist: playlist, area: @area }
  end
end

json.sameAs do
  json.array! [
    "https://www.nhk.jp/d/dk/recommend-editorial-#{@area}",
    "https://dev-preview-eh.nr.nhk.jp/d/dk/recommend-editorial-#{@area}"
  ]
end

json.url @request_url
