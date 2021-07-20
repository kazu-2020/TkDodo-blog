# frozen_string_literal: true

# aw-pl-webから呼び出されるリッチリンク対応のためのエンドポイント
class OgpController < ApplicationController
  def index
    res = ogp_params[:url] && Faraday.get(ogp_params[:url])

    if res&.success?
      render json: make_json(res)
    else
      render json: { message: "Error. url: #{ogp_params[:url]}" }
    end
  end

  private

  def ogp(body)
    OGP::OpenGraph.new(body)
  rescue
    nil
  end

  # @param [Faraday::Response] res
  def make_json(res)
    ogp = ogp(res.body)
    html = Nokogiri::HTML.parse(res.body.to_s)

    { title: ogp&.title || ogp&.site_name || html.title.to_s,
      description: ogp&.description || html.css('//head/meta[name="description"]/@content'),
      image: ogp&.image&.url || 'https://placehold.jp/640x360.png' }
  end

  def ogp_params
    params.permit(:url)
  end
end
