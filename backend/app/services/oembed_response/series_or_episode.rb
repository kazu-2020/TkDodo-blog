# frozen_string_literal: true

# FIXME: 仮でNOLのoembedを利用している。EditorialHands独自のembedページができたら整理する
class OembedResponse::SeriesOrEpisode
  attr_reader :url

  def initialize(url:)
    @url = url
  end

  def response
    src = "https://dev-embed.nr.nhk.jp/p/#{extract_series_or_episode_url}"
    {
      version: '1.0',
      width: '100%',
      height: 236,
      type: 'rich',
      provider_name: 'NHK',
      provider_url: 'https://www.nhk.jp',
      url: url,
      title: 'Dummy',
      thumbnail_width: 640,
      thumbnail_height: 360,
      thumbnail_url: 'http://placehold.jp/640x360.png',
      html: "<iframe width=\"100%\" height=\"234\" src=\"#{src}\" frameborder=\"0\"></iframe>"
    }
  end

  private

  # NOTE: seriesの場合、トレイリングスラッシュなしはdevのoEmbedAPIで無効なURLとして扱われる
  # NOTE: エイリアスを指定すると正しいembedが返ってこない
  # @return [String] dev-embed.nr.nhk.jp用のURL ts/ 以降
  def extract_series_or_episode_url
    url[%r{https?://.*nhk.jp.*/p/.*(ts/[A-Z0-9]{10}/.*)}, 1]
  end
end
