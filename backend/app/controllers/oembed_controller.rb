# frozen_string_literal: true

class OembedController < ApplicationController
  def index
    res = OembedResponse.new(url: params[:url]).response

    if res
      render json: res
    else
      # FIXME: 不正なURLの場合、bad requestなど返した方が良さそうだがとりあえず。
      render json: { message: "Not Found. url: #{params[:url]}" }, status: 404
    end
  end
end
