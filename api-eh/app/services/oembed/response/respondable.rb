# frozen_string_literal: true

module Oembed::Response::Respondable
  attr_reader :url, :height

  def initialize(url:, height:)
    @url = url
    @height = height
  end

  def response
    raise NotImplementedError
  end

  def src_host
    Rails.env.development? ? 'http://localhost:8888' : 'https://dev-api-eh.nr.nhk.jp'
  end
end
