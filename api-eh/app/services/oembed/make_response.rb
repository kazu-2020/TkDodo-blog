# frozen_string_literal: true

class Oembed::MakeResponse
  include ActiveModel::Validations

  attr_reader :url, :max_width, :max_height

  validates :url, presence: true

  def initialize(url:, max_width: nil, max_height: nil)
    @url = url
    @max_width = max_width.to_i.zero? ? nil : max_width.to_i
    @max_height = max_height.to_i.zero? ? nil : max_height.to_i
  end

  def call
    raise ArgumentError unless valid?

    responser.response
  rescue DlabApiClient::NotFound
    nil
  end

  private

  # rubocop:disable Metrics/AbcSize
  def responser
    if series_url?
      Oembed::Response::Series.new(url: url, max_width: max_width, max_height: max_height)
    elsif episode_url?
      Oembed::Response::Episode.new(url: url, max_width: max_width, max_height: max_height)
    elsif howto_url?
      Oembed::Response::Howto.new(url: url, max_width: max_width, max_height: max_height)
    elsif event_url?
      Oembed::Response::Event.new(url: url, max_width: max_width, max_height: max_height)
    elsif faq_page_url?
      Oembed::Response::FaqPage.new(url: url, max_width: max_width, max_height: max_height)
    else
      Oembed::Response::Dummy.new(url: url, max_width: max_width, max_height: max_height)
    end
  end
  # rubocop:enable Metrics/AbcSize

  # @example
  #   https://www.nhk.jp/p/gendai/ts/WV5PLY8R43/
  #   https://www.nhk.jp/p/ts/WV5PLY8R43/
  # @return [TrueClass, FalseClass]
  def series_url?
    url.match?(%r{https?://.*nhk.jp.*/p/.*ts/[A-Z0-9]{10}/?$})
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
