# frozen_string_literal: true

class OembedDebuggerController < ApplicationController
  def episode_summary
    episode_id = params[:episode_id] || 'MY514KPKKM'
    @embed_type = params[:embed_type] || 'episode'

    res = DlabApiClient.new.episode_bundle(type: 'tv',
                                           episode_id: episode_id,
                                           query: { ignoreRange: false })


    @episode_data = res[:tvepisode].first
    series_id = res.dig(:tvseries, :id)
    # @event_data = res[:event]&.first
    # @faq_page_data = res[:faqpage]&.first
    # @howto_data = res[:howto]&.first

    @src = "#{host}/embed/ts/#{series_id}/episode/te/#{episode_id}"
  end

  def host
    Rails.env.development? ? 'http://localhost:8888' : 'https://dev-api-eh.nr.nhk.jp'
  end
end
