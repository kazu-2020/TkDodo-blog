# frozen_string_literal: true

class OembedController < ApplicationController
  def index
    res = OembedResponse.new(url: params[:url]).response

    render json: res
  end
end
