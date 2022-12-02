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
json.formatGenreName playlist.format_genre_name
json.themeGenreCode playlist.theme_genre_code
json.themeGenreName playlist.theme_genre_name
json.selectedPalette playlist.selected_palette
json.primaryLightColor playlist.primary_light_color
json.primaryDarkColor playlist.primary_dark_color
json.textLightColor playlist.text_light_color
json.textDarkColor playlist.text_dark_color
json.linkLightColor playlist.link_light_color
json.linkDarkColor playlist.link_dark_color
if playlist.same_as.present?
  json.sameAs do
    json.array! playlist.same_as do |same_as|
      json.id same_as.id
      json.name same_as.name
      json.url same_as.url
    end
  end
end
if playlist.logo_image_url
  json.logo do
    json.medium do
      json.url image_url(playlist.logo_image_attacher)
      json.width playlist.logo_image.width
      json.height playlist.logo_image.height
    end
  end
end
if playlist.eyecatch_image_url
  json.eyecatch do
    json.medium do
      json.url image_url(playlist.eyecatch_image_attacher)
      json.width playlist.eyecatch_image.width
      json.height playlist.eyecatch_image.height
    end
  end
end
if playlist.hero_image_url
  json.hero do
    json.medium do
      json.url image_url(playlist.hero_image_attacher)
      json.width playlist.hero_image.width
      json.height playlist.hero_image.height
    end
  end
end

json.itemNum playlist.playlist_items.count
if ActiveRecord::Type::Boolean.new.cast(params[:with_episode_count])
  json.playableItemsCount playlist.playable_playlist_items_count
end

json.layoutPattern playlist.layout_pattern
json.datePublished playlist.published_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')

json.markedHeader playlist.marked_header
json.editorData playlist.editor_data
json.markedBody playlist.marked_body
json.articleBody playlist.article_body
json.markedFooter playlist.marked_footer

json.dateCreated playlist.created_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
json.dateModified playlist.updated_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
