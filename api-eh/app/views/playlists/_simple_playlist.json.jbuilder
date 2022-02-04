# frozen_string_literal: true

json.id playlist.string_id
json.originalId playlist.original_id
json.internalId playlist.id
json.name playlist.name
json.apiState playlist.api_state
json.detailedNameRuby playlist.detailed_name_ruby
json.description playlist.description
json.headline playlist.headline
json.keywords playlist.keywords
json.detailedCatch playlist.detailed_catch
json.hashtag playlist.hashtags
json.formatGenre playlist.format_genre_code
json.formatGenreName playlist.format_genre_name
json.themeGenre playlist.theme_genre_code
json.themeGenreName playlist.theme_genre_name
json.style do
  json.selectedPalette playlist.selected_palette
  json.primaryLight playlist.primary_light_color
  json.primaryDark playlist.primary_dark_color
  json.textLight playlist.text_light_color
  json.textDark playlist.text_dark_color
  json.linkLight playlist.link_light_color
  json.linkDark playlist.text_dark_color
end
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
      json.url playlist.logo_image_url
      json.width playlist.logo_image.width
      json.height playlist.logo_image.height
    end
  end
end
if playlist.eyecatch_image_url
  json.eyecatch do
    json.medium do
      json.url playlist.eyecatch_image_url
      json.width playlist.eyecatch_image.width
      json.height playlist.eyecatch_image.height
    end
  end
end
if playlist.hero_image_url
  json.hero do
    json.medium do
      json.url playlist.hero_image_url
      json.width playlist.hero_image.width
      json.height playlist.hero_image.height
    end
  end
end
json.itemNum playlist.playlist_items.count
json.layoutPattern playlist.layout_pattern
json.originalSeriesId playlist.original_series_id if playlist.original_series_id
json.datePublished playlist.published_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')

json.article do
  json.header playlist.marked_header
  json.body playlist.editor_data
  json.markedBody playlist.marked_body
  json.plainBody playlist.article_body
  json.footer playlist.marked_footer
end

json.dateCreated playlist.created_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
json.dateModified playlist.updated_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
