# frozen_string_literal: true

class DlabPlApiClient < DlabApiBase
  API_ENDPOINT = 'https://pl.nhk.jp'

  VERSION = 'd5'

  def deck(area_id:)
    res = client.get "/#{VERSION}/pl/#{area_id}/deck.json"

    handle_response(res)
  end

  def playlist(playlist_type:, playlist_id:)
    res = client.get "/#{VERSION}/pl/#{playlist_type}/#{playlist_id}.json"

    handle_response(res)
  end

  private

  def api_endpoint
    API_ENDPOINT
  end
end
