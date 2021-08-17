# frozen_string_literal: true

count = @playlists.count
min_position = @offset
max_position = @offset + @size

json.count count
json.set_raw! :result, (@playlists[min_position...max_position] || []).to_json

# rubocop:disable Layout/LineLength
json.nextUrl "#{external_playlists_url(deck_id: @deck_id)}.json?area=#{@area}&type=#{@object_type}&offset=#{@offset + @size}&size=#{@size}" if count > @offset + @size
json.prevUrl "#{external_playlists_url(deck_id: @deck_id)}.json?area=#{@area}&type=#{@object_type}&offset=#{@offset - @size}&size=#{@size}" if @offset.positive?
# rubocop:enable Layout/LineLength
