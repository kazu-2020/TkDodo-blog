# frozen_string_literal: true

if @series_bundle[:tvseries].present?
  json.tvseries do
    json.count @series_bundle[:tvseries].count
  end
end

if @series_bundle[:tvepisode].present?
  json.tvepisode do
    json.count @series_bundle[:tvepisode].count
  end
end

if @series_bundle[:faqpage].present?
  json.faqpage do
    json.count @series_bundle[:faqpage].count
  end
end

if @series_bundle[:howto].present?
  json.howto do
    json.count @series_bundle[:howto].count
  end
end

if @series_bundle[:event].present?
  json.event do
    json.count @series_bundle[:event].count
  end
end
