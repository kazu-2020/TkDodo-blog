# frozen_string_literal: true

class OembedController < ApplicationController
  def index
    # FIXME: cacheが効いて上手く動いてないので暫定でダミーのレスポンスを作って返すように。
    # url = params[:url]
    # res = DlabOembedClient.new.oembed(url: url)
    res = dummy_response

    render json: res
  end

  private

  def dummy_response
    url = params[:url]
    series_id = url[/https?:\/\/.*nhk.jp.*\/ts\/([A-Z1-9]{10})/, 1] || 'WV5PLY8R43'
    episode_id = url[/https?:\/\/.*nhk.jp.*\/te\/([A-Z1-9]{10})/, 1] || 'P25ZGZRV29'

    {
      version: "1.0",
      width: "100%",
      height: 231,
      type: "rich",
      provider_name: "NHK",
      provider_url: "https://www.nhk.jp",
      url: "https://www.nhk.jp/p/ts/#{series_id}{/episode/te/#{episode_id}/",
      title: "TVSeries##{series_id} - Episode##{episode_id}",
      thumbnail_width: 640,
      thumbnail_height: 360,
      thumbnail_url: "http://placehold.jp/640x360.png",
      html: "<iframe width=\"100%\" height=\"231\" src=\"https://dev-embed.nr.nhk.jp/p/ts/#{series_id}/episode/te/#{episode_id}/\" frameborder=\"0\"></iframe>"
    }
  end
end
