# frozen_string_literal: true

class Embed::EventsController < EmbedController
  def show
    set_episode_data
    set_event_data
    set_height

    render 'embed/not_found', status: :not_found and return if @episode_data.blank? || @event_data.blank?
  rescue DlabApiBase::NotFound
    render 'embed/not_found', status: :not_found
  end

  private

  def set_height
    @height = embed_event_params[:height] || 210
  end

  def set_episode_data
    @episode_data = DlabApiClient.new
                                 .episode(type: 'tv',
                                          episode_id: embed_event_params[:episode_id],
                                          query: { ignoreRange: false })
  end

  def set_event_data
    @event_data = DlabApiClient.new.event(event_id: embed_event_params[:id], query: { ignoreRange: false })
  end

  def embed_event_params
    params.permit(:id, :episode_id, :height)
  end
end
