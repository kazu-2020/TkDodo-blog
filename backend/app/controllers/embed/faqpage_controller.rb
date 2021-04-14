# frozen_string_literal: true

class Embed::FaqpageController < EmbedController
  def show
    episode_id = params[:episode_id]
    res = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp').episode_bundle(type: 'tv', episode_id: episode_id)
    @episode_data = res[:tvepisode].first
    faqpage_id = params[:id]
    @faqpage_data = res[:faqpage].find { |h| h[:id] == faqpage_id }
  end
end
