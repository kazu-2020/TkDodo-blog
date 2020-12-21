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

  # TVEpisode 検索APIをリクエストする
  #
  # @param [String] word: 検索したい文字列
  # @param [Integer] offset: 開始インデックス
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

  # Series データ一式をリクエストする
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] series_id: シリーズID
  def series_bundle(type:, series_id:)
    res = client.get "/#{VERSION}/t/bundle/#{type.downcase.first}s/#{series_id}.json", INTERNAL_PARAMS
    handle_response(res)
  end

  # TV/Radio Series List APIをリクエストする
  # シリーズ単位でリスト化するAPI
  #
  # @see https://md.dlab.nhk.or.jp/p/r1HGkXGYV#/
  # @param [String] type: 'tv' or 'radio'
  # @param [Integer] size: 取得件数(2019/04/15時点で2,354件)
  # @param [Integer] offset: 開始インデックス
  def series_ids(type:, size:, offset:, query: {})
    res = client.get "/#{VERSION}/ids/#{type}Series.json",
                     INTERNAL_PARAMS.merge(size: size, offset: offset).merge(query)
    handle_response(res)
  end

  # シリーズをシリーズID指定で取得する
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] series_id: シリーズID
  def series(type:, series_id:, query: {})
    res = client.get "/#{VERSION}/t/#{type}series/#{type.downcase.first}s/#{series_id}.json",
                     INTERNAL_PARAMS.merge(query)
    handle_response(res)
  end

  # エピソードをエピソードID指定で取得する
  #
  # @param [String] type: 'tvepisode' or 'radioepisode'
  # @param [String] episode_id: エピソードID
  def episode(type:, episode_id:, query: {})
    res = client.get "/#{VERSION}/t/#{type.downcase}/#{type.downcase.first}e/#{episode_id}.json",
                     INTERNAL_PARAMS.merge(query)
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

  # シリーズIDでエピソードIDを取得する
  # 最大で10000件しか返ってこない
  # :nextUrl に次ページのリンクが入って返ってくる、次ページがない場合はnil
  # @param [String] type
  # @param [String] series_id
  # @param [Integer] size
  # @param [Integer] offset
  def episode_ids(type:, series_id:, size: 10_000, offset: 0, query: {})
    prefix = type == 'tv' ? 'TV' : 'Radio'
    res = client.get "/#{VERSION}/ids/#{prefix}Episode.json",
                     { size: size, "#{type.downcase.first}s": series_id, offset: offset }.merge(query)
    handle_response(res)
  end

  # シリーズIDでエピソードIDを全件取得する
  # @param [String] type
  # @param [String] series_id
  def episode_ids_all(type:, series_id:)
    ids = res = episode_ids(type: type, series_id: series_id)
    while res[:nextUrl].present?
      res = handle_response(client.get(res[:nextUrl]))
      ids[:entities].concat(res[:entities])
    end
    ids
  end

  # @param [String] type
  # @param [Array] ids
  def bulk(type:, ids:, query: {})
    res = client.get "/#{VERSION}/t/#{type}episode/bulk.json",
                     INTERNAL_PARAMS.merge("#{type.downcase.first}e": ids.join(',')).merge(query)
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

  private

  def api_endpoint
    API_ENDPOINT
  end
end
