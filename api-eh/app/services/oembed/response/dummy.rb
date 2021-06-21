# frozen_string_literal: true

class Oembed::Response::Dummy
  include Oembed::Response::Respondable

  def response
    { html: '<p>ダミーです。</p>' }
  end
end
