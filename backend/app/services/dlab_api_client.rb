# frozen_string_literal: true

class DlabApiClient < DlabApiBase
  API_ENDPOINT = if Jets.env.development? || Jets.env.test? || Jets.env.staging?
                   'https://dev-api.nr.nhk.jp'
                 elsif Jets.env.production?
                   'https://api.nr.nhk.jp'
                 else
                   'dummy'
                 end

  VERSION = 'r6'
  INTERNAL_PARAMS = { extendedEntities: true, ignoreRange: true }.freeze
  DEFAULT_OFFSET = 0
  DEFAULT_SIZE = 10
  DEFAULT_SORT_TYPE = 'scoreDesc'

  def initialize(api_endpoint: nil)
    super()
    @api_endpoint = api_endpoint || API_ENDPOINT
  end

  # TVEpisode 検索APIをリクエストする
  #
  # @param [Hash] search_params
  def search(search_params)
    word = search_params[:word]
    offset = search_params[:offset] || DEFAULT_OFFSET
    ignore_range = search_params[:ignore_range].nil? ? true : search_params[:ignore_range]
    sort_type = search_params[:sort_type] || DEFAULT_SORT_TYPE
    size = search_params[:size] || DEFAULT_SIZE

    res = client.get "/#{VERSION}/s/extended.json",
                     INTERNAL_PARAMS.merge(type: 'TVEpisode', word: word, concerns: word, offset: offset, isFuzzy: true,
                                           ignoreRange: ignore_range, sortType: sort_type, size: size)
    handle_response(res)
  end

  # Episode データ一式をリクエストする
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] episode_id: エピソードID
  def episode_bundle(type:, episode_id:)
    res = client.get "/#{VERSION}/t/bundle/#{type.downcase.first}e/#{episode_id}.json", INTERNAL_PARAMS
    handle_response(res)
  end

  # Episode データをリクエストする
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] episode_id: エピソードID
  def episode(type:, episode_id:)
    res = client.get "/#{VERSION}/t/tvepisode/#{type.downcase.first}e/#{episode_id}.json", INTERNAL_PARAMS
    handle_response(res)
  end

  # Series データ一式をリクエストする
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] series_id: シリーズID
  def series_bundle(type:, series_id:)
    res = client.get "/#{VERSION}/t/bundle/#{type.downcase.first}s/#{series_id}.json", INTERNAL_PARAMS
    handle_response(res)
  end

  # エピソードをブロードキャストイベント指定で取得する
  #
  # @param [String] type: 'tvepisode' or 'radioepisode'
  # @param [String] broadcast_event_id: ブロードキャストイベントID
  def episode_from_broadcast_event(type:, broadcast_event_id:, query: {})
    res = client.get "/#{VERSION}/t/#{type.downcase}/be/#{broadcast_event_id}.json",
                     INTERNAL_PARAMS.merge(query)
    handle_response(res)
  end

  # broadcast_eventを broadcast_event_id 指定で取得する
  #
  # @param [String] broadcast_event_id
  def broadcast_event(broadcast_event_id, query = {})
    res = client.get "/#{VERSION}/t/broadcastevent/be/#{broadcast_event_id}.json",
                     INTERNAL_PARAMS.merge(query)
    handle_response(res)
  end

  # broadcast_eventを episode_id 指定で取得する
  #
  # @param [String] episode_id
  # @param [Hash] query
  def broadcast_event_from_episode_id(episode_id, query = {})
    res = client.get "/#{VERSION}/t/broadcastevent/te/#{episode_id}.json",
                     INTERNAL_PARAMS.merge(query)
    handle_response(res)
  end

  # Howto データをリクエストする
  #
  # @param [String] howto_id: ハウツーID
  def howto(howto_id:)
    res = client.get "/#{VERSION}/t/howto/id/#{howto_id}.json", INTERNAL_PARAMS
    handle_response(res)
  end

  private

  attr_reader :api_endpoint
end
