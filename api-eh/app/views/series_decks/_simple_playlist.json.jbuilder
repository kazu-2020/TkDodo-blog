# frozen_string_literal: true

json.id playlist.id
json.seriesId playlist.series_id
json.stringId playlist.string_id
json.name playlist.name
if playlist.logo.present?
  json.logo do
    json.medium do
      json.url playlist.logo[:medium][:url]
      json.width playlist.logo[:medium][:width]
      json.height playlist.logo[:medium][:height]
    end
  end
end
json.set_raw! :videos, playlist.videos.to_json

if params[:with_episode_count]
  json.tvepisodeCount playlist.episode_count
  json.howtoCount playlist.howto_count
  json.faqpageCount playlist.faqpage_count
  json.eventCount playlist.event_count
  json.recipeCount playlist.recipe_count
end
