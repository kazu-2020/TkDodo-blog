# frozen_string_literal: true

class Embed::EventsController < EmbedController
  def show
    # NOTE: prd環境で登録が少ないため一旦devを見るように
    res = DlabApiClient.new(api_endpoint: 'https://dev-api.nr.nhk.jp')
                       .episode_bundle(type: 'tv',
                                       episode_id: embed_event_params[:episode_id],
                                       query: { ignoreRange: false })
    set_episode_data(res)
    set_event_data(res)
    set_height

    render 'embed/not_found', status: :not_found and return if @episode_data.blank? || @event_data.blank?
  rescue DlabApiBase::NotFound
    render 'embed/not_found', status: :not_found
  end

  private

  def set_height
    @height = embed_event_params[:height] || 210
  end

  def set_episode_data(api_response)
    @episode_data = api_response[:tvepisode].first
  end

  def set_event_data(api_response)
    @event_data = api_response[:event].find { |h| h[:id] == embed_event_params[:id] }
  end

  def embed_event_params
    params.permit(:id, :episode_id, :height)
  end
end
