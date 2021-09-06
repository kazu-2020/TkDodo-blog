# frozen_string_literal: true

json.tvepisode do
  json.count @playlist.playlist_items.count
end

if @playlist.full?
  json.faqpage do
    json.count @playlist.faq_page_count
  end

  json.howto do
    json.count @playlist.how_to_count
  end

  json.event do
    json.count @playlist.event_count
  end
end
