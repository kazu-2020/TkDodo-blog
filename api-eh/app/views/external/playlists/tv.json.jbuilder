# frozen_string_literal: true

count = @playlists.count
min_position = @offset
max_position = @offset + @size
base_params = params.permit(:area, :type, :size, :consumeAction, :order, :orderBy, :itemSize, :itemOffset)
next_url_params = base_params.merge(offset: @offset + @size).to_param
prev_url_params = base_params.merge(offset: @offset - @size).to_param

json.count count
json.result(@playlists[min_position...max_position] || []) do |playlist|
  json.partial! partial: 'external/decks/playlist',
                locals: { playlist: playlist, area: @area, deck_type: 'tv', object_type: @object_type,
                          media_action: params[:mediaAction], size: @item_size, offset: @item_offset,
                          item_order: params[:itemOrder] }
end

json.nextUrl "#{external_playlists_url(deck_id: @deck_id)}.json?#{next_url_params.to_param}" if count > @offset + @size
json.prevUrl "#{external_playlists_url(deck_id: @deck_id)}.json?#{prev_url_params.to_param}" if @offset.positive?
