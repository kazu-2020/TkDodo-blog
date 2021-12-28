json.nplaylist do
  json.active true
  json.available true
end

if @playlist.deliver_article_via_api
  json.narticle do
    json.active true
    json.available @playlist.has_article?
  end
end

if @playlist.deliver_item_list_via_api && @playlist.deliver_episode_via_api
  json.tvepisode do
    json.active true
    json.available @playlist.playlist_items.size.positive?
  end
end

if @playlist.full?
  if @playlist.deliver_item_list_via_api && @playlist.deliver_event_via_api
    json.event do
      json.active true
      json.available @playlist.event_count.positive?
    end
  end

  if @playlist.deliver_item_list_via_api && @playlist.deliver_faq_page_via_api
    json.faqpage do
      json.active true
      json.available @playlist.faq_page_count.positive?
    end
  end

  if @playlist.deliver_item_list_via_api && @playlist.deliver_how_to_via_api
    json.howto do
      json.active true
      json.available @playlist.how_to_count.positive?
    end
  end
end
