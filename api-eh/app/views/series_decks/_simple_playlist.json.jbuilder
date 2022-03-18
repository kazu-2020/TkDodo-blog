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
