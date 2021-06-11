# frozen_string_literal: true

module Oembed::Response::Respondable
  attr_reader :url, :max_width, :max_height

  def initialize(url:, max_width:, max_height:)
    @url = url
    @max_width = max_width || 620
    @max_height = max_height
  end

  def response
    raise NotImplementedError
  end

  def src_host
    Jets.env.development? ? 'http://localhost:8888' : 'https://dev-api-eh.nr.nhk.jp'
  end
end
