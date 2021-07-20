# frozen_string_literal: true

# aw-pl-webから呼び出されるリッチリンク対応のためのエンドポイント
class OgpController < ApplicationController
  def index
    res = link_parse_params[:url] && Faraday.get(link_parse_params[:url])

    if res&.success?
      ogp = ogp(res.body)
      html = Nokogiri::HTML.parse(res.body.to_s)

      render json: { title: ogp&.title || ogp&.site_name || html.title.to_s,
                     description: ogp&.description || html.css('//head/meta[name="description"]/@content'),
                     image: ogp&.image&.url || 'https://placehold.jp/640x360.png' }
    else
      render json: { message: "Error. url: #{link_parse_params[:url]}" }
    end
  end

  private

  def ogp(body)
    OGP::OpenGraph.new(body)
  rescue
    nil
  end

  def link_parse_params
    params.permit(:url)
  end
end
