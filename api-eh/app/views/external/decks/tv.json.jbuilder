# frozen_string_literal: true

json.type 'NDeck'
json.id @deck.deck_id('tv')
json.name @deck.name
json.description @deck.description

json.identifierGroup do
  json.deckUId @deck.deck_uid
  json.deckId @deck.deck_id('tv')
  json.deckName @deck.name
  json.typeOfDeck @deck.type_of_deck
end

deck_id = params[:deck_id].split('-').unshift('recommend').uniq.join('-')

merge_param = { itemOffset: @item_offset, itemSize: @item_size, size: @size, offset: @offset,
                order: params[:playlistOrder].nil? ? nil : @order,
                orderBy: params[:playlistOrderBy].nil? ? nil : @order_by,
                itemOrder: params[:itemOrder].nil? ? nil : @item_order }
              .delete_if { |_, v| v.nil? }
url_params = params.permit(:area, :type, :mediaAction).merge(merge_param).to_param

json.playlistUrl "#{external_playlists_url(deck_id: deck_id)}.json?#{url_params.to_param}"

json.sameAs do
  json.array! []
end

json.url @request_url
