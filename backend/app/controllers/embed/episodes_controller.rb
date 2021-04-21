# frozen_string_literal: true

class Embed::EpisodesController < EmbedController
  def show
    episode_id = params[:episode_id]
    @episode_data = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp').episode(type: 'tv', episode_id: episode_id)

    render 'embed/not_found', status: :not_found and return if @episode_data.blank?
  end
end
