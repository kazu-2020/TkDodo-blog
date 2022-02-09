# frozen_string_literal: true

media_action ||= nil

json.dateCreated playlist.created_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
json.dateModified playlist.updated_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
json.description playlist.description
json.detailedCatch playlist.detailed_catch

json.partial! 'shared/playlist_images', playlist: playlist

json.playlistUId playlist.string_id

json.identifierGroup do
  json.playlistUId playlist.string_uid
  json.playlistId playlist.string_id
  json.playlistName playlist.name
  json.hashtag playlist.hashtags
  json.aliasId playlist.alias_id || ''
  json.formatGenre format_genre(playlist)
  json.themeGenre theme_genre(playlist)
end

json.additionalProperty do
  json.layoutPattern playlist.layout_pattern
  json.publishLevel playlist.publish_level
  json.typeOfList playlist.type_of_list
  json.modeOfItem playlist.mode_of_item
  json.typeOfItem type_of_item(object_type)
end

if playlist.decks.present?
  json.relatedDeck do
    json.array! playlist.decks do |deck|
      deck_id = deck.deck_id(deck_type)
      json.type 'NDeck'
      json.id deck_id
      json.name deck.name
      json.description deck.description
      json.identifierGroup do
        json.deckUId deck.visible_uid
        json.deckId deck_id
        json.deckName deck.name
        json.typeOfDeck deck.item_type
      end
      json.url deck_url(deck, deck_id, object_type)
    end
  end
end

json.name playlist.name
json.style do
  json.primaryLight playlist.primary_light_color
  json.primaryDark playlist.primary_dark_color
  json.textLight playlist.text_light_color
  json.textDark playlist.text_dark_color
  json.linkLight playlist.link_light_color
  json.linkDark playlist.link_dark_color
end

json.type 'NPlaylist'
if playlist.same_as.present?
  json.sameAs do
    json.array! playlist.same_as do |same_as|
      json.name same_as.name
      json.url same_as.url
    end
  end
else
  json.sameAs nil
end

base_url = 'https://dev-api-eh.nr.nhk.jp/d6.6'

url_params =
  { area: area, type: object_type, mediaAction: media_action }
  .delete_if { |_, v| v.nil? }
  .to_param
url_params = "?#{url_params}"
json.url base_url + "/t/nplaylist/pl/#{playlist.string_id}.json#{url_params}"

media_action_params = media_action&.split(',') || []
item_url_params =
  { size: size, offset: offset, availableOn: media_action_params.include?('watch') ? 'okushibu' : nil,
    order: item_order.nil? ? nil : item_order }
  .delete_if { |_, v| v.nil? }
  .to_param
item_url_params = "?#{item_url_params}"
json.itemUrl base_url + "/l/tvepisode/pl/#{playlist.string_id}.json#{item_url_params}"

if playlist.deliver_article_via_api && playlist.has_article?
  json.playlisticle do
    json.mainEntityOfPage ''
    json.name playlist.name
    json.headline playlist.headline
    json.keywords playlist.keywords
    json.description playlist.description
    json.articleBody playlist.article_body
    json.detailedArticleBody do
      json.markedHeader playlist.marked_header
      json.markedBody playlist.marked_body
      json.markedFooter playlist.marked_footer
    end

    json.author playlist.author_type
    json.authorName playlist.author_name
    json.publisher playlist.publisher_type
    json.publisherType playlist.publisher_name
    json.dateCreated playlist.created_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
    json.datePublished playlist.published_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
    json.dateModified playlist.updated_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
  end
end
