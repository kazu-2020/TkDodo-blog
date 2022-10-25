# frozen_string_literal: true

class EmbedController < ApiBaseController
  layout 'embed'
  after_action :allow_iframe

  private

  def allow_iframe
    response.headers['X-Frame-Options'] = 'ALLOWALL'
  end
end
