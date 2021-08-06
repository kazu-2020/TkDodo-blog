count = @howtos.size
min_position = @offset
max_position = @offset + @size

json.count count
json.set_raw! :result, (@howtos[min_position...max_position] || []).to_json

json.nextUrl "#{howtos_external_playlist_url}.json?offset=#{@offset + @size}&size=#{@size}" if count > @offset + @size
json.prevUrl "#{howtos_external_playlist_url}.json?offset=#{@offset - @size}&size=#{@size}" if @offset.positive?
