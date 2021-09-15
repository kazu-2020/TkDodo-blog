# frozen_string_literal: true

class Oembed::Response::Playlist
  include Oembed::Response::Respondable

  DEFAULT_HEIGHT = {
    summary: 210,
    featuredItem: 385,
    itemList: 210,
    largeImage: 210
  }.freeze

  # rubocop:disable Metrics/MethodLength
  def response
    playlist = Playlist.find(extract_playlist_id)
    src = "#{src_host}/embed/#{extract_playlist_url}?layout_pattern=#{playlist.layout_pattern}"
    height ||= DEFAULT_HEIGHT[playlist.layout_pattern.to_sym] || 210
    {
      version: '1.0',
      width: 240,
      height: height,
      type: 'rich',
      provider_name: 'NHK',
      provider_url: 'https://www.nhk.jp',
      url: url,
      title: playlist.name,
      thumbnail_width: 640,
      thumbnail_height: 360,
      thumbnail_url: playlist.logo_image_url,
      html: "<iframe width=\"240\" height=\"#{height}\" src=\"#{src}\" style=\"border: 0;\"></iframe>"
    }
  end
  # rubocop:enable Metrics/MethodLength

  private

  # @return [String] dev-embed.nr.nhk.jp用のURL pl/ 以降
  def extract_playlist_url
    url[%r{https?://dev-www-eh.nr.nhk.jp/p/(pl/eh-[A-Z0-9]{10})}, 1]
  end

  def extract_playlist_id
    url[%r{https?://dev-www-eh.nr.nhk.jp/p/pl/eh-([A-Z0-9]{10})}, 1].to_i
  end
end
