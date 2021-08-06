count = @playlist.playlist_items.kept.count
min_position = @offset + 1     # position は 1 始まり
max_position = @offset + @size # position は 1 始まり
episodes =
  @playlist.playlist_items.kept.where(position: min_position..max_position).map do |item|
    fetch_episode_data(playlist_item: item, force_fetch: false)
  end

json.count count
json.set_raw! :result, episodes.to_json

json.nextUrl "#{episodes_external_playlist_url}.json?offset=#{@offset + @size}&size=#{@size}" if count > @offset + @size
json.prevUrl "#{episodes_external_playlist_url}.json?offset=#{@offset - @size}&size=#{@size}" if @offset.positive?
