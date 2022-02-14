# frozen_string_literal: true

class Oembed::MakeResponse
  include ActiveModel::Validations

  attr_reader :url, :height

  validates :url, presence: true

  def initialize(url:, height: nil)
    @url = url
    @height = height.to_i.zero? ? nil : height.to_i
  end

  def call
    raise ArgumentError unless valid?

    responser.response
  rescue DlabApiClient::NotFound
    nil
  end

  private

  def responser # rubocop:disable all
    if series_url?
      Oembed::Response::Series.new(url: url, height: height)
    elsif playlist_url?
      Oembed::Response::Playlist.new(url: url, height: height)
    elsif series_playlist_url?
      Oembed::Response::SeriesPlaylist.new(url: url, height: height)
    elsif episode_url?
      Oembed::Response::Episode.new(url: url, height: height)
    elsif howto_url?
      Oembed::Response::Howto.new(url: url, height: height)
    elsif event_url?
      Oembed::Response::Event.new(url: url, height: height)
    elsif faq_page_url?
      Oembed::Response::FaqPage.new(url: url, height: height)
    else
      Oembed::Response::Dummy.new(url: url, height: height)
    end
  end

  # @example
  #   https://www.nhk.jp/p/gendai/ts/WV5PLY8R43/
  #   https://www.nhk.jp/p/ts/WV5PLY8R43/
  # @return [TrueClass, FalseClass]
  def series_url?
    url.match?(%r{https?://.*nhk.jp.*/p/.*ts/[A-Z0-9]{10}/?$})
  end

  # @example
  #   https://dev-www-eh.nr.nhk.jp/p/pl/recommend-tep-0000000030
  # @return [TrueClass, FalseClass]
  def playlist_url?
    url.match?(%r{https?://dev-www-eh.nr.nhk.jp/p/pl/recommend-tep-([A-Z0-9]{10})})
  end

  # @example
  #   https://dev-www-eh.nr.nhk.jp/p/pl/ts-N8GR183W9M/series
  # @return [TrueClass, FalseClass]
  def series_playlist_url?
    url.match?(%r{https?://dev-www-eh.nr.nhk.jp/p/pl/ts-([A-Z0-9]{10})})
  end

  # @example
  #   https://www.nhk.jp/p/gendai/ts/WV5PLY8R43/episode/te/Z8PR8XKNLM/
  def episode_url?
    url.match?(%r{https?://.*nhk.jp.*/p/.*ts/[A-Z0-9]{10}/episode/te/[A-Z0-9]{10}})
  end

  # @example
  #   https://www.nhk.jp/p/gc/ts/E5Q48579J3/howto/55/
  def howto_url?
    url.match?(%r{https?://.*nhk.jp.*/p/.*ts/[A-Z0-9]{10}/howto/[0-9]+})
  end

  # @example
  #   https://dev-www.nhk.jp/p/ts/D4VPQVK78M/event/94/
  def event_url?
    url.match?(%r{https?://.*nhk.jp.*/p/.*ts/[A-Z0-9]{10}/event/[0-9]+})
  end

  # @example
  #   https://www.nhk.jp/p/kyounoryouri/ts/XR5ZNJLM2Q/faqpage/965
  # NOTE: 現在、NOLにFAQPageは独立したページを持たないためURLは実在しない
  def faq_page_url?
    url.match?(%r{https?://.*nhk.jp.*/p/.*ts/[A-Z0-9]{10}/faqpage/[0-9]+})
  end
end
