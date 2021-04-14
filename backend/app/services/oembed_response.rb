# frozen_string_literal: true

class OembedResponse
  attr_reader :url

  def initialize(url:)
    @url = url
  end

  def response
    responser.response
  end

  private

  def responser
    if series_url? || episode_url?
      SeriesOrEpisode.new(url: url)
    elsif howto_url?
      Howto.new(url: url)
    elsif event_url?
      Event.new(url: url)
    elsif faq_page_url?
      Faqpage.new(url: url)
    else
      Dummy.new(url: url)
    end
  end

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
  def howto_url?
    url.match?(%r{https?://.*nhk.jp.*/p/.*ts/[A-Z0-9]{10}/howto/[0-9]+})
  end

  # @example
  #   https://dev-www.nhk.jp/p/ts/D4VPQVK78M/event/94/
  def event_url?
    url.match?(%r{https?://.*nhk.jp.*/p/.*ts/[A-Z0-9]{10}/event/[0-9]+})
  end

  # @example
  #   https://www.nhk.jp/p/ts/KVJY7PKWX2/faqpage/19/
  # NOTE: 現在、NOLにfaqpageは独立したページを持たないためURLは実在しない
  def faq_page_url?
    url.match?(%r{https?://.*nhk.jp.*/p/.*ts/[A-Z0-9]{10}/faqpage/[0-9]+})
  end
end
