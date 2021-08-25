# frozen_string_literal: true

class Embed::HowtosController < EmbedController
  def show
    res = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp')
                       .episode_bundle(type: 'tv', episode_id: params[:episode_id], query: { ignoreRange: false })
    set_episode_data(res)
    set_event_data(res)
    set_height

    render 'embed/not_found', status: :not_found and return if @episode_data.blank? || @howto_data.blank?
  rescue DlabApiBase::NotFound
    render 'embed/not_found', status: :not_found
  end

  private

  def set_height
    @height = embed_howto_params[:height] || 210
  end

  def set_episode_data(api_response)
    @episode_data = api_response[:tvepisode].first
  end

  def set_event_data(api_response)
    @howto_data = api_response[:howto].find { |h| h[:id] == embed_howto_params[:id] }
  end

  def embed_howto_params
    params.permit(:id, :episode_id, :height)
  end
end
