# frozen_string_literal: true

if @playlist.output_item_list_to_bundle && @playlist.output_episode_to_bundle
  json.tvepisode do
    json.count @playlist.playlist_items.count
  end
end

if @playlist.output_item_list_to_bundle && @playlist.output_faq_page_to_bundle
  json.faqpage do
    json.count @playlist.faq_page_count
  end
end

if @playlist.output_item_list_to_bundle && @playlist.output_how_to_to_bundle
  json.howto do
    json.count @playlist.how_to_count
  end
end

if @playlist.output_item_list_to_bundle && @playlist.output_event_to_bundle
  json.event do
    json.count @playlist.event_count
  end
end

# TODO: narticle の数をどう出すか（もしくは出さないか）は議論の後、コードを変更する
if @playlist.output_article_to_bundle
  json.narticle do
    json.count 1
  end
end
