# frozen_string_literal: true

# aw-pl-webから呼び出されるリッチリンク対応のためのエンドポイント
class RichlinkController < ApplicationController
  def index
    raise DlabApiBase::InternalServerError if richlink_params[:url].blank?

    json = playlist_page_url? ? parse_playlist : parse_html
    if json
      render json: json
    else
      render json: { message: "Error. url: #{richlink_params[:url]}" }
    end
  end

  private

  def ogp(body)
    OGP::OpenGraph.new(body)
  rescue
    nil
  end

  def parse_playlist
    playlist_id = richlink_params[:url][playlist_page_url_regex, 1].to_i
    pl = Playlist.find(playlist_id)

    { title: pl.name,
      description: pl.description,
      image: pl.eyecatch_image_url || 'https://placehold.jp/640x360.png' }
  end

  def parse_html
    res = Faraday.get(richlink_params[:url])
    return nil unless res&.success?

    make_json(res)
  end

  # @param [Faraday::Response] res
  def make_json(res)
    ogp = ogp(res.body)
    html = Nokogiri::HTML.parse(res.body.to_s)

    { title: ogp&.title || ogp&.site_name || html.title.to_s,
      description: ogp&.description || html.css('//head/meta[name="description"]/@content'),
      image: ogp&.image&.url || 'https://placehold.jp/640x360.png' }
  end

  def richlink_params
    params.permit(:url)
  end

  def playlist_page_url?
    richlink_params[:url].match?(playlist_page_url_regex)
  end

  # FIXME: ドメインが振られたら変更する
  def playlist_page_url_regex
    %r{https?://psychic-eureka-90cdb0a4.pages.github.io/p/pl/eh-([A-Z0-9]{10})}
  end
end
