# frozen_string_literal: true

class DlabR65ApiClient < DlabApiBase
  API_ENDPOINT = 'https://api.dlab.nhk.or.jp'
  VERSION = 'd6.5'

  attr_reader :api_endpoint

  def initialize(api_endpoint: nil)
    super()
    @api_endpoint = api_endpoint || API_ENDPOINT
  end

  def episode_playlist(episode_id)
    res = client.get "/#{VERSION}/l/nplaylist/te/#{episode_id}.json"
    handle_response(res)
  end

  def keyword_playlist(keyword)
    res = client.get "/#{VERSION}/t/ndeck/search/tv.json", { keyword: keyword, area: 130 }
    handle_response(res)
  end
end
