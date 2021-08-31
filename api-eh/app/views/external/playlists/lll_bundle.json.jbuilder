json.nplaylist do
  json.active true
  json.available true
end

if @playlist.output_article_to_bundle
  json.narticle do
    json.active true
    json.available @playlist.has_article?
  end
end

if @playlist.output_item_list_to_bundle && @playlist.output_episode_to_bundle
  json.tvepisode do
    json.active true
    json.available @playlist.playlist_items.size.positive?
  end
end

if @playlist.output_item_list_to_bundle && @playlist.output_event_to_bundle
  json.event do
    json.active true
    json.available @playlist.event_count.positive?
  end
end

if @playlist.output_item_list_to_bundle && @playlist.output_faq_page_to_bundle
  json.faqpage do
    json.active true
    json.available @playlist.faq_page_count.positive?
  end
end

if @playlist.output_item_list_to_bundle && @playlist.output_how_to_to_bundle
  json.howto do
    json.active true
    json.available @playlist.how_to_count.positive?
  end
end
