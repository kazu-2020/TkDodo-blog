# frozen_string_literal: true

json.type 'NPlaylist'
json.id @playlist.original_id
json.name @playlist.name
json.detailedSeriesNameRuby @playlist.detailed_name_ruby

json.identifierGroup do
  json.playlistUId @playlist.string_id
  json.playlistId @playlist.original_id
  json.playlistName @playlist.name
  json.hashtag @playlist.hashtags
  json.aliasId @playlist.alias_id || ''
  json.formatGenre format_genre(@playlist)
  json.themeGenre theme_genre(@playlist)
end

json.additionalProperty do
  json.layoutPattern @playlist.layout_pattern
  json.publishLevel @playlist.publish_level
  json.typeOfList @playlist.type_of_list
  json.modeOfItem @playlist.mode_of_item
  json.typeOfItem type_of_item(@object_type)
end

if @playlist.deck.present?
  json.relatedDeck do
    json.array! [@playlist.deck] do |deck|
      deck_id = deck.deck_id('visible')
      json.type 'NDeck'
      json.id deck_id
      json.name @playlist.deck.name
      json.description @playlist.deck.description
      json.identifierGroup do
        json.deckUId @playlist.deck.visible_uid
        json.deckId deck_id
        json.deckName @playlist.deck.name
        json.typeOfDeck @playlist.deck.item_type
      end
      json.url deck_url(@playlist.deck, deck_id, @object_type)
    end
  end
end

json.keywords @playlist.keywords
json.description @playlist.description
json.detailedCatch @playlist.detailed_catch
json.style do
  json.primaryLight @playlist.primary_light_color
  json.primaryDark @playlist.primary_dark_color
  json.textLight @playlist.text_light_color
  json.textDark @playlist.text_dark_color
  json.linkLight @playlist.link_light_color
  json.linkDark @playlist.link_dark_color
end
json.dateCreated @playlist.created_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
json.datePublished @playlist.published_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
json.dateModified @playlist.updated_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')

unless @is_min_mode
  json.actor fetch_unique_actors(@playlist)
  json.contributor fetch_unique_contributors(@playlist)
end

json.partial! 'shared/playlist_images', playlist: @playlist

json.citations do
  json.array! @playlist.citations do |citation|
    json.id citation.id
    json.name citation.name
    json.url citation.url
  end
end

json.url "https://dev-www-eh.nr.nhk.jp/p/pl/#{@playlist.original_id}"

if @playlist.same_as.present?
  json.sameAs do
    json.array! @playlist.same_as do |same_as|
      json.name same_as.name
      json.url same_as.url
    end
  end
else
  json.sameAs nil
end

media_action_params = (params[:mediaAction] || '').split(',')
item_url_params =
  { size: params[:itemSize].nil? ? nil : @size, offset: params[:itemOffset].nil? ? nil : @offset,
    availableOn: media_action_params.include?('watch') ? 'okushibu' : nil,
    order: params[:itemOrder].nil? ? nil : @order }
  .delete_if { |_, v| v.nil? }
  .to_param
item_url_params = "?#{item_url_params}" if item_url_params.size.positive?

case @object_type
when 'event'
  json.itemUrl "#{events_external_playlist_url(@playlist.original_id)}.json#{item_url_params}"
when 'howto'
  json.itemUrl "#{howtos_external_playlist_url(@playlist.original_id)}.json#{item_url_params}"
when 'faqpage'
  json.itemUrl "#{faqpages_external_playlist_url(@playlist.original_id)}.json#{item_url_params}"
else
  json.itemUrl "#{episodes_external_playlist_url(@playlist.original_id)}.json#{item_url_params}"
end

if @playlist.deliver_article_via_api
  json.playlisticle do
    json.mainEntityOfPage ''
    json.name @playlist.name
    json.headline @playlist.headline
    json.keywords @playlist.keywords
    json.description @playlist.description
    json.articleBody @playlist.article_body
    json.detailedArticleBody do
      json.markedHeader @playlist.marked_header
      json.markedBody @playlist.marked_body
      json.markedFooter @playlist.marked_footer
    end

    json.author @playlist.author_type
    json.authorName @playlist.author_name
    json.publisher @playlist.publisher_type
    json.publisherType @playlist.publisher_name
    json.dateCreated @playlist.created_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
    json.datePublished @playlist.published_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
    json.dateModified @playlist.updated_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
  end
end
