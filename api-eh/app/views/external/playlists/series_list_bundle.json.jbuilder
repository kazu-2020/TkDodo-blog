# frozen_string_literal: true

series = @series_bundle[:tvseries].present? ? 'tvseries' : nil
episodes = @series_bundle[:tvepisode].present? ? 'tvepisode' : nil
faq_pages = @series_bundle[:faqpage].present? ? 'faqpage' : nil
howtos = @series_bundle[:howto].present? ? 'howto' : nil
events = @series_bundle[:event].present? ? 'event' : nil

json.result do
  json.array! [
    series,
    episodes,
    faq_pages,
    howtos,
    events
  ].compact
end
