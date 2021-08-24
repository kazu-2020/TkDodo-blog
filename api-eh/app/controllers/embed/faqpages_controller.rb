# frozen_string_literal: true

class Embed::FaqpagesController < EmbedController
  def show
    res = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp')
                       .episode_bundle(type: 'tv', episode_id: params[:episode_id], query: { ignoreRange: false })
    set_episode_data(res)
    set_faq_page_data(res)
    set_height

    render 'embed/not_found', status: :not_found and return if @episode_data.blank? || @faq_page_data.blank?
  rescue DlabApiBase::NotFound
    render 'embed/not_found', status: :not_found
  end

  private

  def set_height
    @height = embed_faq_page_params[:height] || 210
  end

  def set_episode_data(api_response)
    @episode_data = api_response[:tvepisode].first
  end

  def set_faq_page_data(api_response)
    @faq_page_data = api_response[:faqpage].find { |h| h[:id] == embed_faq_page_params[:id] }
  end

  def embed_faq_page_params
    params.permit(:id, :episode_id, :height)
  end
end
