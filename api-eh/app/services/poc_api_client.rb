# frozen_string_literal: true

# 社会実証用のAPIクライアント
class PocApiClient < DlabApiBase
  API_ENDPOINT =
    if Rails.env.development? || Rails.env.test?
      # TODO: e2eで使用するdocker-composeにIS_E2E環境変数を追加してください
      ENV['IS_E2E'] == 'true' ? 'http://r6.0:4011' : 'https://dev-api.nr.nhk.jp'
    elsif Rails.env.dev?
      'https://dev-api-int.local.nr.nhk.jp'
    elsif Rails.env.staging?
      'https://stg-api-int.local.nr.nhk.jp'
    elsif Rails.env.production?
      'https://api-int.local.nr.nhk.jp'
    else
      'dummy'
    end
  VERSION = 'r6.0'
  INTERNAL_PARAMS = { extendedEntities: true, ignoreRange: true }.freeze
  DEFAULT_ENVIRONMENT = 'okushibu3'
  DEFAULT_TYPE_OF_LIST = 'recommend'
  DEFAULT_MODE_OF_ITEM = 'tv'

  attr_reader :api_endpoint, :version

  def initialize(api_endpoint: nil, version: nil)
    super()
    @api_endpoint = api_endpoint || API_ENDPOINT
    @version = version || VERSION
  end

  # TVEpisode 検索APIをリクエストする
  #   r6との差分例
  #    ignoreRangeがない
  #    typeOfListが追加
  #    modeOfItemが追加
  #
  # @param [Hash] query
  def search(query: {})
    res = client.get "/#{version}/s/extended.json", INTERNAL_PARAMS.merge(query)
    handle_response(res)
  end

  # TvEpisode データを取得する
  #   r6との差分例
  #     identifierGroupExがない
  #     videosにembedUrlがない
  #
  # @param [String] episode_id: エピソードID
  # @param [Hash] query
  def episode(episode_id:, query: {})
    res = client.get "/#{version}/t/tvepisode/te/#{episode_id}.json", INTERNAL_PARAMS.merge(query)
    handle_response(res)
  end

  # TvEpisode データを取得する
  #
  # @param [String] playlist_id: プレイリストID
  # @param [Hash] query
  def episode_from_playlist(playlist_id:, query: {})
    res = client.get "/#{version}/l/tvepisode/pl/#{playlist_id}.json", query
    handle_response(res)
  end

  # 視聴可能なエピソードを取得する
  #
  # @param [String] playlist_id: プレイリストID
  def available_episode_from_playlist(playlist_id:)
    res = client.get "/#{version}/l/tvepisode/pl/#{playlist_id}.json", { availableOn: DEFAULT_ENVIRONMENT }
    begin
      handle_response(res)
    rescue DlabApiBase::NotFound # 視聴可能なエピソードがない場合エラーとして処理されるのでその対応
      {}
    end
  end

  # プレイリスト下の全TvEpisodeID に紐づく各type数を取得する
  #
  # @param [String] playlist_id: プレイリストID
  def playlist_ll_bundle(playlist_id:)
    res = client.get "/#{version}/ll/bundle/pl/#{playlist_id}/types.json"
    handle_response(res)
  end
end
