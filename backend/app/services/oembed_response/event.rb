# frozen_string_literal: true

class OembedResponse::Event
  attr_reader :url

  def initialize(url:)
    @url = url
  end

  # rubocop:disable Metrics/MethodLength
  def response
    # NOTE: prd環境で登録が少ないため一旦devを見るように
    res = DlabApiClient.new(api_endpoint: 'https://dev-api.nr.nhk.jp').event(event_id: extract_event_id)
    episode_id = res.dig(:identifierGroup, :episodeId)

    raise DlabApiClient::NotFound if episode_id.blank?

    src = "#{OembedResponse.src_host}/embed/te/#{episode_id}/event/#{extract_event_id}"
    {
      version: '1.0',
      width: '100%',
      height: 340,
      type: 'rich',
      provider_name: 'NHK',
      provider_url: 'https://www.nhk.jp',
      url: url,
      title: res[:name] || 'Dummy',
      thumbnail_width: res.dig(:image, :medium, :width) || 640,
      thumbnail_height: res.dig(:image, :medium, :height) || 360,
      thumbnail_url: res.dig(:image, :medium, :url) || 'http://placehold.jp/640x360.png',
      html: "<iframe width=\"100%\" height=\"340\" src=\"#{src}\" frameborder=\"0\"></iframe>"
    }
  end
  # rubocop:enable Metrics/MethodLength

  private

  def extract_event_id
    url[%r{https?://.*nhk.jp.*/p/.*/event/([0-9]+)}, 1]
  end
end
