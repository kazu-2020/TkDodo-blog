# frozen_string_literal: true

class OembedResponse::Episode
  attr_reader :url

  def initialize(url:)
    @url = url
  end

  def response
    src = "#{OembedResponse.src_host}/embed/#{extract_series_and_episode_url}"
    {
      version: '1.0',
      width: '100%',
      height: 200,
      type: 'rich',
      provider_name: 'NHK',
      provider_url: 'https://www.nhk.jp',
      url: url,
      title: 'Episode',
      thumbnail_width: 640,
      thumbnail_height: 360,
      thumbnail_url: 'http://placehold.jp/640x360.png',
      html: "<iframe width=\"100%\" height=\"234\" src=\"#{src}\" frameborder=\"0\"></iframe>"
    }
  end

  private

  # https://www.nhk.jp/p/gendai/ts/WV5PLY8R43/episode/te/Z8PR8XKNLM/
  # @return [String] dev-embed.nr.nhk.jp用のURL ts/ 以降
  def extract_series_and_episode_url
    url[%r{https?://.*nhk.jp.*/p/.*(ts/[A-Z0-9]{10}/episode/te/[A-Z0-9]{10})}, 1]
  end
end
