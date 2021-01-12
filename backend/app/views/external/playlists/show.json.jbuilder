# frozen_string_literal: true

json.type 'NPlaylist'
json.id @request_url
json.name @playlist.name
json.detailedSeriesNameRuby @playlist.detailed_name_ruby

json.identifierGroup do
  json.playlistUId @playlist.string_id
  json.playlistId "eh-#{format('%010d', @playlist.id)}"
  json.playlistName @playlist.name
  json.typeOfList 'recommend'
  json.modeOfItem 'tv'
  json.typeOfItem type_of_item(@object_type)
  json.hashtag @playlist.hashtags
  json.aliasId @playlist.alias_id || ''
  json.deckId deck_ids(@playlist)
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

# rubocop:disable Metrics/BlockLength
json.items @playlist.playlist_items.each.with_index(1).to_a do |playlist_item, index|
  episode_data = fetch_episode_data(playlist_item: playlist_item)

  case @object_type
  when 'videoobject'
    options = @area.present? ? { area: @area } : {}
    broadcast_event = fetch_boradcast_event(episode_data, options)
    next if broadcast_event.nil?

    json.set_raw! :item, broadcast_event[:video].first.to_json
    json.position index
  when 'broadcastevent'
    options = @area.present? ? { area: @area } : {}
    broadcast_event = fetch_boradcast_event(episode_data, options)
    next if broadcast_event.nil?

    json.set_raw! :item, broadcast_event.to_json
    json.position index
  else
    json.type 'TVEpisode'
    json.id playlist_item.episode_id
    json.url episode_data[:url]
    json.name episode_data[:name]

    if episode_data[:sameAs].present?
      json.sameAs episode_data[:sameAs] do |same_as|
        json.name same_as[:name]
        json.url same_as[:url]
      end
    else
      json.sameAs nil
    end
  end
end
# rubocop:enable Metrics/BlockLength

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
