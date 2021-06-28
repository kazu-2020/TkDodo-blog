# frozen_string_literal: true

class Embed::FaqpagesController < EmbedController
  def show
    res = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp')
                       .episode_bundle(type: 'tv', episode_id: params[:episode_id], query: { ignoreRange: false })
    @episode_data = res[:tvepisode].first
    faq_page_id = params[:id]
    @faq_page_data = res[:faqpage].find { |h| h[:id] == faq_page_id }

    render 'embed/not_found', status: :not_found and return if @episode_data.blank? || @faq_page_data.blank?
  rescue DlabApiBase::NotFound
    render 'embed/not_found', status: :not_found
  end
end
