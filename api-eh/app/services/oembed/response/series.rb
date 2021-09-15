# frozen_string_literal: true

class Oembed::Response::Series
  include Oembed::Response::Respondable

  DEFAULT_HEIGHT = {
    summary: 210,
    featuredItem: 385,
    itemList: 210,
    largeImage: 210
  }.freeze

  # rubocop:disable Metrics/MethodLength
  def response
    res = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp').series(type: 'tv', series_id: extract_series_id)
    raise DlabApiClient::NotFound if res.blank?

    layout_pattern = res.dig(:additionalProperty, :layoutPattern)

    src = "#{src_host}/embed/#{extract_series_url}?layout_pattern=#{layout_pattern}"
    height ||= DEFAULT_HEIGHT[layout_pattern.to_sym]
    {
      version: '1.0',
      width: '100%',
      height: height,
      type: 'rich',
      provider_name: 'NHK',
      provider_url: 'https://www.nhk.jp',
      url: url,
      title: 'Series',
      thumbnail_width: 640,
      thumbnail_height: 360,
      thumbnail_url: 'https://placehold.jp/640x360.png',
      html: "<iframe width=\"100%\" height=\"#{height}\" src=\"#{src}\" style=\"border: 0;\"></iframe>"
    }
  end
  # rubocop:enable Metrics/MethodLength

  private

  # https://www.nhk.jp/p/gendai/ts/WV5PLY8R43
  # @return [String] dev-embed.nr.nhk.jp用のURL ts/ 以降
  def extract_series_url
    url[%r{https?://.*nhk.jp.*/p/.*(ts/[A-Z0-9]{10})}, 1]
  end

  def extract_series_id
    url[%r{https?://.*nhk.jp.*/p/.*ts/([A-Z0-9]{10})}, 1]
  end
end
