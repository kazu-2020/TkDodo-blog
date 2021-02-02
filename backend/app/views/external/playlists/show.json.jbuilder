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
json.dateCreated @playlist.created_at
json.datePublished @playlist.published_at
json.dateModified @playlist.updated_at
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

json.url "https://master.d32t4o5i7c0bll.amplifyapp.com/#/playlists/#{@playlist.string_id}"

if @playlist.same_as.present?
  json.sameAs do
    json.name @playlist.same_as.name
    json.url @playlist.same_as.url
  end
else
  json.sameAs nil
end

json.items @playlist.playlist_items.each do |playlist_item|
  episode_data = fetch_episode_data(playlist_item: playlist_item)

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
  else
    json_data = ::MultiJson.load(episode_data.to_json)

    json_data.each_key do |key|
      json.set_raw! key, json_data[key].to_json
    end
  end
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
  json.dateCreated @playlist.created_at
  json.datePublished @playlist.published_at
  json.dateModified @playlist.updated_at
end
