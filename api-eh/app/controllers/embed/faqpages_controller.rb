# frozen_string_literal: true

class Embed::FaqpagesController < EmbedController
  def show
    set_episode_data
    set_faq_page_data
    set_height

    render 'embed/not_found', status: :not_found and return if @episode_data.blank? || @faq_page_data.blank?
  rescue DlabApiBase::NotFound
    render 'embed/not_found', status: :not_found
  end

  private

  def set_height
    @height = embed_faq_page_params[:height] || 210
  end

  def set_episode_data
    @episode_data = DlabApiClient.new
                                 .episode(type: 'tv',
                                          episode_id: embed_faq_page_params[:episode_id],
                                          query: { ignoreRange: false })
  end

  def set_faq_page_data
    @faq_page_data = DlabApiClient.new
                                  .faq_page(faq_page_id: embed_faq_page_params[:id], query: { ignoreRange: false })
  end

  def embed_faq_page_params
    params.permit(:id, :episode_id, :height)
  end
end
