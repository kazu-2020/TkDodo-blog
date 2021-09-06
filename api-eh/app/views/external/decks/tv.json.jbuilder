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

json.set! 'playlists' do
  json.array! @playlists.first(10).each do |playlist|
    json.partial! partial: 'external/decks/playlist',
                  locals: { playlist: playlist, area: @area, deck_type: 'tv', object_type: @object_type }
  end
end

deck_id = params[:deck_id].split('-').unshift('recommend').uniq.join('-')
position = [(params[:position] || 1).to_i, 1].max
offset = ((position - 1) / 10).to_i * 10

next_url_params = params.permit(:area, :type, :mediaAction, :order, :orderBy).merge(offset: offset, size: 10).to_param
json.playlistUrl "#{external_playlists_url(deck_id: deck_id)}.json?#{next_url_params.to_param}#position=#{position}"

json.sameAs do
  json.array! [
    "https://www.nhk.jp/d/dk/recommend-tv-#{@area}",
    "https://dev-preview-eh.nr.nhk.jp/d/dk/recommend-tv-#{@area}"
  ]
end

json.url @request_url
