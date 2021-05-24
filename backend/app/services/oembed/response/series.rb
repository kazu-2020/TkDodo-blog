# frozen_string_literal: true

class Oembed::Response::Series
  include Oembed::Response::Respondable

  def response
    src = "#{src_host}/embed/#{extract_series_url}"
    height = max_height || 234
    {
      version: '1.0',
      width: max_width,
      height: height,
      type: 'rich',
      provider_name: 'NHK',
      provider_url: 'https://www.nhk.jp',
      url: url,
      title: 'Series',
      thumbnail_width: 640,
      thumbnail_height: 360,
      thumbnail_url: 'http://placehold.jp/640x360.png',
      html: "<iframe width=\"#{max_width}\" height=\"#{height}\" src=\"#{src}\" frameborder=\"0\"></iframe>"
    }
  end

  private

  # https://www.nhk.jp/p/gendai/ts/WV5PLY8R43
  # @return [String] dev-embed.nr.nhk.jp用のURL ts/ 以降
  def extract_series_url
    url[%r{https?://.*nhk.jp.*/p/.*(ts/[A-Z0-9]{10})}, 1]
  end
end
