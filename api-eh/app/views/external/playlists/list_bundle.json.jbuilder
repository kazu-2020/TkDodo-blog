# frozen_string_literal: true

series = @playlist.output_item_list_to_bundle && @playlist.output_episode_to_bundle ? 'tvseries' : nil
episodes = @playlist.output_item_list_to_bundle && @playlist.output_episode_to_bundle ? 'tvepisode' : nil
faq_pages = @playlist.output_item_list_to_bundle && @playlist.output_faq_page_to_bundle ? 'faqpage' : nil
howtos = @playlist.output_item_list_to_bundle && @playlist.output_how_to_to_bundle ? 'howto' : nil
events = @playlist.output_item_list_to_bundle && @playlist.output_event_to_bundle ? 'event' : nil
article = @playlist.output_article_to_bundle ? 'narticle' : nil

json.result do
  json.array! [
    series,
    episodes,
    faq_pages,
    howtos,
    events,
    article
  ].compact
end
