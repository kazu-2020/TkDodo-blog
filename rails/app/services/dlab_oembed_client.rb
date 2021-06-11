# frozen_string_literal: true

class DlabOembedClient < DlabApiBase
  API_ENDPOINT = 'https://dev-www.nhk.jp'

  def oembed(url:)
    res = client.get '/oembed', { url: url }
    handle_response(res)
  end

  private

  def api_endpoint
    API_ENDPOINT
  end
end
