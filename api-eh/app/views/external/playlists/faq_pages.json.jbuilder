count = @faq_pages.size
min_position = @offset
max_position = @offset + @size

json.count count
json.set_raw! :result, (@faq_pages[min_position...max_position] || []).to_json

json.nextUrl "#{faqpages_external_playlist_url}.json?offset=#{@offset + @size}&size=#{@size}" if count > @offset + @size
json.prevUrl "#{faqpages_external_playlist_url}.json?offset=#{@offset - @size}&size=#{@size}" if @offset.positive?
