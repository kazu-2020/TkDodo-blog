# frozen_string_literal: true

class ApplicationController < Jets::Controller::Base
  before_action :set_content_type

  def set_content_type
    response.headers['Content-Type'] = 'application/json'
  end
end
