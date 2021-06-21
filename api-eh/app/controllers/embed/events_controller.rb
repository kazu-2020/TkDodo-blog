# frozen_string_literal: true

class Embed::EventsController < EmbedController
  def show
    # NOTE: prd環境で登録が少ないため一旦devを見るように
    res = DlabApiClient.new(api_endpoint: 'https://dev-api.nr.nhk.jp')
                       .episode_bundle(type: 'tv', episode_id: params[:episode_id], query: { ignoreRange: false })
    @episode_data = res[:tvepisode].first
    event_id = params[:id]
    @event_data = res[:event].find { |h| h[:id] == event_id }

    render 'embed/not_found', status: :not_found and return if @episode_data.blank? || @event_data.blank?
  rescue DlabApiBase::NotFound
    render 'embed/not_found', status: :not_found
  end
end
