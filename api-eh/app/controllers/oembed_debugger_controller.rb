# frozen_string_literal: true

class OembedDebuggerController < ApplicationController
  def summary
    @type = params[:type] || 'episode'

    case @type
    when 'episode'
      episode
    when 'event'
      event
    when 'howto'
      howto
    when 'faqpage'
      faqpage
    else
      raise Error
    end
  end

  def featured_item
    @type = params[:type] || 'pl' # or 'ts'
    @id = params[:id] || 'eh-0000000005' # or 'W3W8WRN8M3'
    @src = "/embed/#{@type}/#{@id}?layout_pattern=featured_item"
  end

  def host
    Rails.env.development? ? 'http://localhost:8888' : 'https://dev-api-eh.nr.nhk.jp'
  end

  private

  def episode
    @id = params[:id] || 'MY514KPKKM'

    res = DlabApiClient.new.episode_bundle(type: 'tv', episode_id: @id, query: { ignoreRange: false })
    @episode_data = res[:tvepisode].first
    # @event_data = res[:event]&.first
    # @faq_page_data = res[:faqpage]&.first
    # @howto_data = res[:howto]&.first
    series_id = res.dig(:tvseries, :id)
    @src = "#{host}/embed/ts/#{series_id}/episode/te/#{@id}"
  end

  def event
    @id = params[:id] || '94'

    client = DlabApiClient.new(api_endpoint: 'https://dev-api.nr.nhk.jp') # NOTE: prd環境で登録が少ないため一旦devを見るように

    @event_data = client.event(event_id: @id)
    @series_data = client.series(type: 'tv', series_id: @event_data.dig(:identifierGroup, :seriesId))

    @src = "#{host}/embed/te/#{@event_data.dig(:identifierGroup, :episodeId)}/event/#{@id}"
  end

  def howto
    @id = params[:id] || '6'

    client = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp')
    @howto_data = client.howto(howto_id: @id)
    @series_data = client.series(type: 'tv', series_id: @howto_data.dig(:identifierGroup, :seriesId))

    @src = "#{host}/embed/te/#{@howto_data.dig(:identifierGroup, :episodeId)}/howto/#{@id}"
  end

  def faqpage
    @id = params[:id] || '122'

    client = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp')
    @faq_page_data = client.faq_page(faq_page_id: @id)
    @series_data = client.series(type: 'tv', series_id: @faq_page_data.dig(:identifierGroup, :seriesId))

    @src = "#{host}/embed/te/#{@faq_page_data.dig(:identifierGroup, :episodeId)}/faqpage/#{@id}"
  end
end
