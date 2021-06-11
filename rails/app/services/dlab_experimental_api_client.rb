# frozen_string_literal: true

class DlabExperimentalApiClient < DlabApiBase
  API_ENDPOINT = 'https://api.dlab.nhk.or.jp'

  VERSION = 'd6.5'

  def playlist(series_id:)
    res = client.get "/#{VERSION}/pl/ts/#{series_id}.json"

    handle_response(res)
  end

  private

  def api_endpoint
    API_ENDPOINT
  end
end
