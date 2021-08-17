# frozen_string_literal: true

class Oembed::Response::Event
  include Oembed::Response::Respondable

  # rubocop:disable Metrics/MethodLength
  def response
    # NOTE: prd環境で登録が少ないため一旦devを見るように
    res = DlabApiClient.new(api_endpoint: 'https://dev-api.nr.nhk.jp').event(event_id: extract_event_id)
    episode_id = res.dig(:identifierGroup, :episodeId)

    raise DlabApiClient::NotFound if episode_id.blank?

    src = "#{src_host}/embed/te/#{episode_id}/event/#{extract_event_id}"
    height ||= 210
    {
      version: '1.0',
      width: 620,
      height: height,
      type: 'rich',
      provider_name: 'NHK',
      provider_url: 'https://www.nhk.jp',
      url: url,
      title: res[:name] || 'Dummy',
      thumbnail_width: res.dig(:image, :medium, :width) || 640,
      thumbnail_height: res.dig(:image, :medium, :height) || 360,
      thumbnail_url: res.dig(:image, :medium, :url) || 'https://placehold.jp/640x360.png',
      html: "<iframe width=\"100%\" height=\"#{height}\" src=\"#{src}\" style=\"border: 0;\"></iframe>"
    }
  end
  # rubocop:enable Metrics/MethodLength

  private

  def extract_event_id
    url[%r{https?://.*nhk.jp.*/p/.*/event/([0-9]+)}, 1]
  end

  def episode_id(res)
    res.dig(:identifierGroup, :episodeId)
  end
end
