# frozen_string_literal: true

class Embed::EpisodesController < EmbedController
  def show
    episode_id = embed_episode_params[:episode_id]
    @episode_data = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp')
                                 .episode(type: 'tv', episode_id: episode_id, query: { ignoreRange: false })
    @height = embed_episode_params[:height] || 210

    render 'embed/not_found', status: :not_found and return if @episode_data.blank?
  rescue DlabApiBase::NotFound
    render 'embed/not_found', status: :not_found
  end

  def embed_episode_params
    params.permit(:series_id, :episode_id, :height)
  end
end
