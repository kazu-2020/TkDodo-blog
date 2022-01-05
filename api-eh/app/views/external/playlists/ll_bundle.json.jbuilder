# frozen_string_literal: true

json.tvepisode do
  json.count @playlist.playlist_items.count
end

if @playlist.full?
  if @playlist.deliver_faq_page_via_api
    json.faqpage do
      json.count @playlist.faq_page_count
    end
  end

  if @playlist.deliver_how_to_via_api
    json.howto do
      json.count @playlist.how_to_count
    end
  end

  if @playlist.deliver_event_via_api
    json.event do
      json.count @playlist.event_count
    end
  end
end
