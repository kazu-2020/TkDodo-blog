count =
  if params[:availableOn] == 'okushibu'
    @playlist.playlist_items.playable.kept.count
  else
    @playlist.playlist_items.kept.count
  end

min_position = @offset + 1     # position は 1 始まり
max_position = @offset + @size # position は 1 始まり
playlist_items = @playlist_items.where(position: min_position..max_position).order(position: @order)

episodes =
  if params[:availableOn] == 'okushibu'
    playlist_items.playable.map do |item|
      fetch_episode_data(playlist_item: item, force_fetch: true)
    end
  else
    playlist_items.map do |item|
      fetch_episode_data(playlist_item: item, force_fetch: true)
    end
  end

json.count count
json.set_raw! :result, episodes.to_json
json.resultUrl request.url

# rubocop: disable Layout/LineLength
if params[:playlist_id]
  if count > @offset + @size
    json.nextUrl "#{episodes_external_playlist_url(@playlist.original_id)}.json?offset=#{@offset + @size}&size=#{@size}"
  end
  if @offset.positive?
    json.prevUrl "#{episodes_external_playlist_url(@playlist.original_id)}.json?offset=#{@offset - @size}&size=#{@size}"
  end
else
  if count > @offset + @size
    json.nextUrl "#{episodes_external_playlist_uid_url(@playlist.string_id)}.json?offset=#{@offset + @size}&size=#{@size}"
  end
  if @offset.positive?
    json.prevUrl "#{episodes_external_playlist_uid_url(@playlist.string_id)}.json?offset=#{@offset - @size}&size=#{@size}"
  end
end
# rubocop: enable Layout/LineLength
