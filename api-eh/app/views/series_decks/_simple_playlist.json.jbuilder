# frozen_string_literal: true

json.id playlist.id
json.seriesId playlist.series_id
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

if params[:with_subtype_item_count].present?
  json.itemNum playlist.episode_count
  json.howToCount playlist.how_to_count
  json.faqPageCount playlist.faq_page_count
  json.eventCount playlist.event_count
end
