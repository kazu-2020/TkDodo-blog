# frozen_string_literal: true

json.type 'NPlaylist'
json.id @playlist.original_id
json.name @playlist.name
json.detailedSeriesNameRuby @playlist.detailed_name_ruby

json.identifierGroup do
  json.playlistUId @playlist.string_id
  json.playlistId @playlist.original_id
  json.playlistName @playlist.name
  json.typeOfList 'recommend'
  json.modeOfItem 'tv'
  json.typeOfItem type_of_item(@object_type)
  json.hashtag @playlist.hashtags
  json.aliasId @playlist.alias_id || ''
  json.formatGenre format_genre(@playlist)
  json.themeGenre theme_genre(@playlist)
end

json.additionalProperty do
  json.layoutPattern @playlist.layout_pattern
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
        json.deckUId @playlist.deck.deck_uid(deck_id)
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
json.actor fetch_unique_actors(@playlist)
json.contributor fetch_unique_contributors(@playlist)

json.partial! 'shared/playlist_images', playlist: @playlist

json.citations do
  json.array! @playlist.citations do |citation|
    json.id citation.id
    json.name citation.name
    json.url citation.url
  end
end

json.url "https://psychic-eureka-90cdb0a4.pages.github.io/p/pl/#{@playlist.original_id}"

if @playlist.same_as.present?
  json.sameAs do
    json.name @playlist.same_as.name
    json.url @playlist.same_as.url
  end
else
  json.sameAs nil
end

# rubocop:disable Metrics/BlockLength
subtype_item_count = 0
json.items @playlist.playlist_items.kept.first(10).each do |playlist_item|
  episode_data = fetch_episode_data(playlist_item: playlist_item, force_fetch: true)

  case @object_type
  when 'videoobject'
    options = @area.present? ? { area: @area } : {}
    broadcast_event = fetch_boradcast_event(episode_data, options)
    next if broadcast_event.nil?

    video_json_data = ::MultiJson.load(broadcast_event.to_json)['video'].first
    next if video_json_data.nil?

    video_json_data.each_key do |key|
      json.set_raw! key, video_json_data[key].to_json
    end
  when 'broadcastevent'
    options = @area.present? ? { area: @area } : {}
    broadcast_event = fetch_boradcast_event(episode_data, options)
    next if broadcast_event.nil?

    json_data = ::MultiJson.load(broadcast_event.to_json)

    json_data.each_key do |key|
      json.set_raw! key, json_data[key].to_json
    end
  when 'event'
    events = fetch_event(episode_data)
    next unless events[:result].present?

    events[:result].each do |event|
      next if subtype_item_count == 10

      json_data = ::MultiJson.load(event.to_json)
      json_data.each_key do |key|
        json.set_raw! key, json_data[key].to_json
      end
      subtype_item_count += 1
    end
  when 'howto'
    howtos = fetch_howto(episode_data)
    next unless howtos[:result].present?

    howtos[:result].each do |howto|
      next if subtype_item_count == 10

      json_data = ::MultiJson.load(howto.to_json)
      json_data.each_key do |key|
        json.set_raw! key, json_data[key].to_json
      end
      subtype_item_count += 1
    end
  when 'faqpage'
    faq_pages = fetch_faq_page(episode_data)
    next unless faq_pages[:result].present?

    faq_pages[:result].each do |faq_page|
      next if subtype_item_count == 10

      json_data = ::MultiJson.load(faq_page.to_json)
      json_data.each_key do |key|
        json.set_raw! key, json_data[key].to_json
      end
      subtype_item_count += 1
    end
  else
    json_data = ::MultiJson.load(episode_data.to_json)

    json_data.each_key do |key|
      json.set_raw! key, json_data[key].to_json
    end
  end
end
# rubocop:enable Metrics/BlockLength

case @object_type
when 'event'
  json.itemUrl "#{events_external_playlist_url(@playlist.original_id)}.json?size=10&offset=0"
when 'howto'
  json.itemUrl "#{howtos_external_playlist_url(@playlist.original_id)}.json?size=10&offset=0"
when 'faqpage'
  json.itemUrl "#{faqpages_external_playlist_url(@playlist.original_id)}.json?size=10&offset=0"
else
  json.itemUrl "#{episodes_external_playlist_url(@playlist.original_id)}.json?size=10&offset=0"
end

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
