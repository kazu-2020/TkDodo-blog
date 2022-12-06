# frozen_string_literal: true

# aw-pl-webから呼び出されるリッチリンク対応のためのエンドポイント
class RichlinkController < ApplicationController
  def index
    raise DlabApiBase::InternalServerError if richlink_params[:url].blank?

    playlist_page_url? ? parse_playlist : parse_html
  rescue => e
    render json: { message: "Error: #{e.message}, url: #{richlink_params[:url]}" }
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

    @title = pl.name
    @description = pl.description
    @image = pl.eyecatch_image_url || pl.dummy_image_url('eyecatch')
    @date = pl.published_at
  end

  def parse_html
    res = Faraday.new(richlink_params[:url], ssl: { verify: false }).get
    return nil unless res&.success?

    make_json_params(res)
  end

  # @param [Faraday::Response] res
  def make_json_params(res) # rubocop:disable Metrics/AbcSize,Metrics/CyclomaticComplexity,Metrics/PerceivedComplexity
    ogp = ogp(res.body)

    require 'kconv'
    html = Nokogiri::HTML.parse(res.body.to_s.toutf8)

    title = ogp&.title || ogp&.site_name || html.title.to_s
    @title = title
    @description = ogp&.description || html.css('//head/meta[name="description"]/@content')&.to_s
    @image = ogp&.image&.url || default_image_url_by(title: title)
    @date = Time.zone.parse(res.headers['Last-Modified']) if res.headers['Last-Modified'].present?
  end

  def richlink_params
    params.permit(:url)
  end

  def playlist_page_url?
    richlink_params[:url].match?(playlist_page_url_regex)
  end

  def playlist_page_url_regex
    %r{https?://dev-www-eh.nr.nhk.jp/p/pl/recommend-tep-([A-Z0-9]{10})}
  end

  # @param [String] title
  def default_image_url_by(title:)
    default_image_number = (title.length % 10) + 1
    "https://dev-eh.nr.nhk.jp/dummy/default#{default_image_number}/default#{default_image_number}-eyecatch.png"
  end
end
