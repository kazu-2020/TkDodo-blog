count = @events.size
min_position = @offset
max_position = @offset + @size

json.count count
json.set_raw! :result, (@events[min_position...max_position] || []).to_json

json.nextUrl events_external_playlist_url(offset: @offset + @size, size: @size) if count > @offset + @size
json.prevUrl events_external_playlist_url(offset: @offset - @size, size: @size) if @offset.positive?
