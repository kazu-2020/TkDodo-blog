# frozen_string_literal: true

class Embed::HowtosController < EmbedController
  def show
    set_episode_data
    set_howto_data
    set_height

    render 'embed/not_found', status: :not_found and return if @episode_data.blank? || @howto_data.blank?
  rescue DlabApiBase::NotFound
    render 'embed/not_found', status: :not_found
  end

  private

  def set_height
    @height = embed_howto_params[:height] || 210
  end

  def set_episode_data
    @episode_data = DlabApiClient.new
                                 .episode(type: 'tv',
                                          episode_id: embed_howto_params[:episode_id],
                                          query: { ignoreRange: false })
  end

  def set_howto_data
    @howto_data = DlabApiClient.new
                               .howto(howto_id: embed_howto_params[:id], query: { ignoreRange: false })
  end

  def embed_howto_params
    params.permit(:id, :episode_id, :height)
  end
end
