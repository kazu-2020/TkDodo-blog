# frozen_string_literal: true

class Embed::HowtoController < EmbedController
  skip_before_action :set_content_type

  def show
    episode_id = params[:episode_id]
    res = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp').episode_bundle(type: 'tv', episode_id: episode_id)
    @episode_data = res[:tvepisode].first
    howto_id = params[:id]
    @howto_data = res[:howto].find { |h| h[:id] == howto_id }
  end
end
