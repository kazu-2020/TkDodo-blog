# frozen_string_literal: true

class Oembed::Response::Episode
  include Oembed::Response::Respondable

  # rubocop:disable Metrics/MethodLength
  def response
    src = "#{src_host}/embed/#{extract_series_and_episode_url}"
    height ||= 210
    {
      version: '1.0',
      width: 620,
      height: height,
      type: 'rich',
      provider_name: 'NHK',
      provider_url: 'https://www.nhk.jp',
      url: url,
      title: 'Episode',
      thumbnail_width: 640,
      thumbnail_height: 360,
      thumbnail_url: 'http://placehold.jp/640x360.png',
      html: "<iframe width=\"100%\" height=\"#{height}\" src=\"#{src}\" frameborder=\"0\"></iframe>"
    }
  end
  # rubocop:enable Metrics/MethodLength

  private

  # https://www.nhk.jp/p/gendai/ts/WV5PLY8R43/episode/te/Z8PR8XKNLM/
  # @return [String] dev-embed.nr.nhk.jp用のURL ts/ 以降
  def extract_series_and_episode_url
    url[%r{https?://.*nhk.jp.*/p/.*(ts/[A-Z0-9]{10}/episode/te/[A-Z0-9]{10})}, 1]
  end
end
