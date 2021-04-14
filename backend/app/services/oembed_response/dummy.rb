# frozen_string_literal: true

class OembedResponse::Dummy
  attr_reader :url

  def initialize(url:)
    @url = url
  end

  def response
    { html: '<p>ダミーです。</p>' }
  end
end
