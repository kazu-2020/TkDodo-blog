# frozen_string_literal: true

series = @playlist.output_item_list_to_bundle && @playlist.output_episode_to_bundle ? 'tvseries' : nil
episodes = @playlist.output_item_list_to_bundle && @playlist.output_episode_to_bundle ? 'tvepisode' : nil
faq_pages = if @playlist.output_item_list_to_bundle && @playlist.output_faq_page_to_bundle && \
               @playlist.faq_page_count.positive?
              'faqpage'
            end
howtos = if @playlist.output_item_list_to_bundle && @playlist.output_how_to_to_bundle && \
            @playlist.how_to_count.positive?
           'howto'
         end
events = if @playlist.output_item_list_to_bundle && @playlist.output_event_to_bundle && \
            @playlist.event_count.positive?
           'event'
         end
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
