# frozen_string_literal: true

# 社会実証用のAPIクライアント
class PocApiClient < DlabApiBase
  API_ENDPOINT =
    if Rails.env.development? || Rails.env.test?
      'https://dev-api.nr.nhk.jp'
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
  DEFAULT_OFFSET = 0
  DEFAULT_SIZE = 10
  DEFAULT_TYPE = 'tvepisode'
  DEFAULT_SORT_ORDER = 'desc'
  DEFAULT_SORT_ORDER_BY = 'score'

  attr_reader :api_endpoint, :version

  def initialize(api_endpoint: nil, version: nil)
    super()
    @api_endpoint = api_endpoint || API_ENDPOINT
    @version = version || VERSION
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
end
