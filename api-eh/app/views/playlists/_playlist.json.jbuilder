# frozen_string_literal: true

json.playlistUId playlist.string_uid
json.stringId playlist.string_id
json.primaryId playlist.id
json.name playlist.name
json.apiState playlist.api_state
json.detailedNameRuby playlist.detailed_name_ruby
json.description playlist.description
json.headline playlist.headline
json.keywords playlist.keywords
json.detailedCatch playlist.detailed_catch
json.hashtags playlist.hashtags
json.formatGenreCode playlist.format_genre_code
json.themeGenreCode playlist.theme_genre_code
json.selectedPalette playlist.selected_palette
json.primaryLightColor playlist.primary_light_color
json.primaryDarkColor playlist.primary_dark_color
json.textLightColor playlist.text_light_color
json.textDarkColor playlist.text_dark_color
json.linkLightColor playlist.link_light_color
json.linkDarkColor playlist.link_dark_color

json.sameAs do
  json.array! playlist.same_as do |same_as|
    json.id same_as.id
    json.name same_as.name
    json.url same_as.url
  end
end

json.citations do
  json.array! playlist.citations do |citation|
    json.id citation.id
    json.name citation.name
    json.url citation.url
  end
end

json.items do
  json.array! playlist.playlist_items.kept do |playlist_item|
    json.partial! partial: 'shared/episode', locals: { episode: playlist_item }
  end
end
json.partial! 'shared/playlist_images', playlist: playlist
json.itemNum playlist.playlist_items.count
json.layoutPattern playlist.layout_pattern
json.publishLevel playlist.publish_level
if ActiveRecord::Type::Boolean.new.cast(params[:with_episode_count])
  json.playableItemsCount playlist.playable_playlist_items_count
end
json.hasHowto playlist.playlist_items.any?(&:has_howto)
json.hasFaqpage playlist.playlist_items.any?(&:has_faqpage)
json.hasEvent playlist.playlist_items.any?(&:has_event)
json.hasRecipe playlist.playlist_items.any?(&:has_recipe)

json.activeItemList playlist.active_item_list
json.activeTvepisode playlist.active_tvepisode
json.activeFaqpage playlist.active_faqpage
json.activeArticle playlist.active_article
json.activeHowto playlist.active_howto
json.activeEvent playlist.active_event
json.activeRecipe playlist.active_recipe

json.markedHeader playlist.marked_header
json.editorData playlist.editor_data
json.articleBody playlist.article_body
json.markedFooter playlist.marked_footer
json.articleContainsEpisodes playlist.article_contains_episodes
json.authorType playlist.author_type
json.authorName playlist.author_name
json.publisherType playlist.publisher_type
json.publisherName playlist.publisher_name

json.aliasId playlist.alias_id

json.actor fetch_unique_actors(playlist)
json.contributor fetch_unique_contributors(playlist)

json.datePublished playlist.published_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
json.dateCreated playlist.created_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
json.dateModified playlist.updated_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
