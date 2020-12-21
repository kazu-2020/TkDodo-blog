# frozen_string_literal: true

json.type 'NDeck'
json.id @identifier_group_deck_id
json.name @deck.name
json.description ''

json.identifierGroup do
  json.deckUId @deck.editorial_uid
  json.deckId @identifier_group_deck_id
  json.deckName @deck.name
  json.typeOfDeck 'recommend'
end

json.set! 'playlists' do
  json.array! @deck.playlists.has_article.each.with_index(1).to_a do |(playlist, index)|
    json.partial! partial: 'external/decks/playlist', locals: { playlist: playlist, index: index, area: @area }
  end
end

json.sameAs do
  json.array! [
    "https://www.nhk.jp/d/dk/recommend-editorial-#{@area}",
    "https://dev-preview-eh.nr.nhk.jp/d/dk/recommend-editorial-#{@area}"
  ]
end

json.url @request_url
