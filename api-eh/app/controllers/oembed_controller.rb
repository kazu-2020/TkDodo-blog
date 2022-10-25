# frozen_string_literal: true

class OembedController < ApiBaseController
  def index
    res = Oembed::MakeResponse.new(url: params[:url], height: params[:height]).call

    if res
      render json: res
    else
      # FIXME: 不正なURLの場合、bad requestなど返した方が良さそうだがとりあえず。
      render json: { message: "Not Found. url: #{params[:url]}" }, status: 404
    end
  end
end
