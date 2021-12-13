# frozen_string_literal: true

bundle_data = @playlist.bundle

# rubocop: disable Metrics/BlockLength
json.nseries do
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
    json.typeOfList 'recommend'
    json.modeOfItem 'tv'
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

  json.url "https://dev-www-eh.nr.nhk.jp/p/pl/#{@playlist.original_id}"

  if @playlist.same_as.present?
    json.sameAs do
      json.name @playlist.same_as.name
      json.url @playlist.same_as.url
    end
  else
    json.sameAs nil
  end
end
# rubocop: enable Metrics/BlockLength

if @playlist.output_episode_to_bundle && @playlist.output_item_list_to_bundle
  json.tvepisode bundle_data[:tvepisode] do |episode|
    json.partial! partial: 'shared/episode', locals: { episode_data: episode }
  end
end

if @playlist.output_article_to_bundle
  json.narticle do
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

if @playlist.output_faq_page_to_bundle && @playlist.output_item_list_to_bundle
  json.faqpage bundle_data[:faqpage] do |faqpage|
    json.partial! partial: 'shared/faqpage', locals: { faqpage: faqpage }
  end
end

if @playlist.output_event_to_bundle && @playlist.output_item_list_to_bundle
  json.event bundle_data[:event] do |event|
    json.partial! partial: 'shared/event', locals: { event: event }
  end
end

if @playlist.output_how_to_to_bundle && @playlist.output_item_list_to_bundle
  json.howto bundle_data[:howto] do |howto|
    json.partial! partial: 'shared/howto', locals: { howto: howto }
  end
end
