# frozen_string_literal: true

class Embed::HowtosController < EmbedController
  def show
    episode_id = params[:episode_id]
    res = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp')
                       .episode_bundle(type: 'tv', episode_id: episode_id, query: { ignoreRange: false })
    @episode_data = res[:tvepisode].first
    howto_id = params[:id]
    @howto_data = res[:howto].find { |h| h[:id] == howto_id }

    render 'embed/not_found', status: :not_found and return if @episode_data.blank? || @howto_data.blank?
  rescue DlabApiBase::NotFound
    render 'embed/not_found', status: :not_found
  end
end
