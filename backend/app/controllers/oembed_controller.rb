# frozen_string_literal: true

class OembedController < ApplicationController
  def index
    # FIXME: cache
    # url = params[:url]
    # res = DlabOembedClient.new.oembed(url: url)

    res = {
      version: '1.0',
      width: '100%',
      height: 231,
      type: 'rich',
      provider_name: 'NHK',
      provider_url: 'https://www.nhk.jp',
      url: 'https://www.nhk.jp/p/ts/WV5PLY8R43/',
      title: 'クローズアップ現代+',
      thumbnail_width: 640,
      thumbnail_height: 360,
      thumbnail_url: 'https://dev-www.nhk.jp/static/assets/images/tvseries/ts/WV5PLY8R43/WV5PLY8R43-eyecatch_m_a291112335ffcb4e67d7f68d0cc5d7c6.jpg',
      html: '<iframe width="100%" height="231" src="https://dev-embed.nr.nhk.jp/p/ts/WV5PLY8R43/" frameborder="0"></iframe>'
    }

    render json: res
  end
end
