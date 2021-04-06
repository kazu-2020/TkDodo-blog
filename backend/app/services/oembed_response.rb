# frozen_string_literal: true

class OembedResponse
  attr_reader :url

  def initialize(url:)
    @url = url
  end

  def response
    if series_url? || episode_url?
      response_body_by_nr
    elsif how_to_url?
      howto_response_body
    else
      dummy_response_body
    end
  end

  private

  # @example
  #   https://www.nhk.jp/p/gendai/ts/WV5PLY8R43/
  #   https://www.nhk.jp/p/ts/WV5PLY8R43/
  # @return [TrueClass, FalseClass]
  def series_url?
    url.match?(%r{https?://.*nhk.jp.*/p/.*ts/[A-Z0-9]{10}/$})
  end

  # @example
  #   https://www.nhk.jp/p/gendai/ts/WV5PLY8R43/episode/te/Z8PR8XKNLM/
  def episode_url?
    url.match?(%r{https?://.*nhk.jp.*/p/.*ts/[A-Z0-9]{10}/episode/te/[A-Z0-9]{10}})
  end

  # @example
  #   https://www.nhk.jp/p/gc/ts/E5Q48579J3/howto/55/
  def how_to_url?
    url.match?(%r{https?://.*nhk.jp.*/p/.*ts/[A-Z0-9]{10}/howto/[0-9]+})
  end

  # NOTE: seriesの場合、トレイリングスラッシュなしはdevのoEmbedAPIで無効なURLとして扱われる
  # NOTE: エイリアスを指定すると正しいembedが返ってこない
  # @return [String] dev-embed.nr.nhk.jp用のURL ts/ 以降
  def extract_series_or_episode_url
    url[%r{https?://.*nhk.jp.*/p/.*(ts/[A-Z0-9]{10}/.*)}, 1]
  end

  def extract_howto_id
    url[%r{https?://.*nhk.jp.*/p/.*/howto/([0-9]+)}, 1]
  end

  def response_body_by_nr
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

  # rubocop:disable Metrics/MethodLength
  def howto_response_body
    res = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp').howto(howto_id: extract_howto_id)
    episode_id = res.dig(:identifierGroup, :episodeId)
    src = "https://dev-eh.nr.nhk.jp/embed/te/#{episode_id}/howto/#{extract_howto_id}"
    # src = "http://localhost:8888/embed/te/#{episode_id}/howto/#{extract_howto_id}"
    {
      version: '1.0',
      width: '100%',
      height: 340,
      type: 'rich',
      provider_name: 'NHK',
      provider_url: 'https://www.nhk.jp',
      url: url,
      title: 'Dummy',
      thumbnail_width: 620,
      thumbnail_height: 340,
      thumbnail_url: 'http://placehold.jp/620x340.png',
      html: "<iframe width=\"100%\" height=\"340\" src=\"#{src}\" frameborder=\"0\"></iframe>"
    }
  end
  # rubocop:enable Metrics/MethodLength

  # FIXME: how_to, event, faq_page
  def dummy_response_body
    { html: '<p>ダミーです。</p>' }
  end
end
