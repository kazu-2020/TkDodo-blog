# frozen_string_literal: true

class Oembed::Response::Playlist
  include Oembed::Response::Respondable

  # rubocop:disable Metrics/MethodLength
  def response
    src = "#{src_host}/embed/#{extract_playlist_url}"
    height ||= 200
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

  # @return [String] dev-embed.nr.nhk.jp用のURL pl/ 以降
  def extract_playlist_url
    url[%r{https?://dev-www-eh.nr.nhk.jp/p/(pl/eh-[A-Z0-9]{10})}, 1]
  end
end
