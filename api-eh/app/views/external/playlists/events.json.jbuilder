count = @events.size
min_position = @offset
max_position = @offset + @size

json.count count
json.set_raw! :result, (@events[min_position...max_position] || []).to_json

if params[:playlist_id]
  if count > @offset + @size
    json.nextUrl "#{events_external_playlist_url(@playlist.original_id)}.json?offset=#{@offset + @size}&size=#{@size}"
  end
  if @offset.positive?
    json.prevUrl "#{events_external_playlist_url(@playlist.original_id)}.json?offset=#{@offset - @size}&size=#{@size}"
  end
else
  if count > @offset + @size
    json.nextUrl "#{events_external_playlist_uid_url(@playlist.string_id)}.json?offset=#{@offset + @size}&size=#{@size}"
  end
  if @offset.positive?
    json.prevUrl "#{events_external_playlist_uid_url(@playlist.string_id)}.json?offset=#{@offset - @size}&size=#{@size}"
  end
end
