# frozen_string_literal: true

class DlabApiClient < DlabApiBase
  API_ENDPOINT =
    if Rails.env.development? || Rails.env.dev? || Rails.env.test?
      ENV['IS_E2E'] == 'true' ? 'http://r6:4010' : 'https://dev-api.nr.nhk.jp'
    elsif Rails.env.staging?
      'https://stg-api.nr.nhk.jp'
    elsif Rails.env.production?
      'https://api.nr.nhk.jp'
    else
      'dummy'
    end
  VERSION = 'r6'
  INTERNAL_PARAMS = { extendedEntities: true, ignoreRange: true }.freeze

  attr_reader :api_endpoint, :version

  def initialize(api_endpoint: nil, version: nil)
    super()
    @api_endpoint = api_endpoint || API_ENDPOINT
    @version = version || VERSION
  end

  # TVEpisode 検索APIをリクエストする
  #
  # @param [Hash] query
  def search(query: {})
    url = "/#{version}/s/extended.json?#{INTERNAL_PARAMS.merge(query).to_query}"
    res = client.get url
    handle_response(response: res, url: url)
  end

  # Episode データ一式をリクエストする
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] episode_id: エピソードID
  # @param [Hash] query
  def episode_l_bundle(type:, episode_id:, query: {})
    url = "/#{version}/l/bundle/#{type.downcase.first}e/#{episode_id}.json?#{INTERNAL_PARAMS.merge(query).to_query}"
    res = client.get url
    handle_response(response: res, url: url)
  end

  # Episode データをリクエストする
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] episode_id: エピソードID
  # @param [Hash] query
  def episode(type:, episode_id:, query: {})
    url = "/#{version}/t/tvepisode/#{type.downcase.first}e/#{episode_id}.json?#{INTERNAL_PARAMS.merge(query).to_query}"
    res = client.get url
    handle_response(response: res, url: url)
  end

  # Series データをリクエストする
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] series_id: シリーズID
  def series(type:, series_id:)
    url = "/#{version}/t/tvseries/#{type.downcase.first}s/#{series_id}.json?#{INTERNAL_PARAMS.to_query}"
    res = client.get url
    handle_response(response: res)
  end

  # Series タイプ総数一式をリクエストする
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] series_id: シリーズID
  # @param [Hash] query
  def series_ll_bundle_types(type:, series_id:, query: {})
    url = "/#{version}/ll/bundle/#{type.downcase.first}s/#{series_id}/types.json?
            #{INTERNAL_PARAMS.merge(query).to_query}"
    res = client.get url
    handle_response(response: res, url: url)
  end

  # エピソードをシリーズ指定で取得する
  #
  # @param [String] type: 'tvepisode' or 'radioepisode'
  # @param [String] series_id: シリーズID
  # @param [String] request_type: t or l
  # @param [Hash] query
  def episode_from_series(type:, series_id:, request_type: :t, query: {})
    url = "/#{version}/#{request_type}/#{type.downcase}episode/ts/#{series_id}.json?
            #{INTERNAL_PARAMS.merge(query).to_query}"
    res = client.get url,
                     INTERNAL_PARAMS.merge(query)
    handle_response(response: res)
  end

  # Howto データをリクエストする
  #
  # @param [String] howto_id: ハウツーID
  def howto(howto_id:, query: {})
    url = "/#{version}/t/howto/id/#{howto_id}.json?#{INTERNAL_PARAMS.merge(query).to_query}"
    res = client.get url
    handle_response(response: res)
  end

  # Event データをリクエストする
  #
  # @param [String] event_id: イベントID
  def event(event_id:, query: {})
    url = "/#{version}/t/event/id/#{event_id}.json?#{INTERNAL_PARAMS.merge(query).to_query}"
    res = client.get url
    handle_response(response: res)
  end

  # FAQPage データをリクエストする
  #
  # @param [String] faq_page_id: FAQPage ID
  def faq_page(faq_page_id:, query: {})
    url = "/#{version}/t/faqpage/id/#{faq_page_id}.json?#{INTERNAL_PARAMS.merge(query).to_query}"
    res = client.get url
    handle_response(response: res)
  end

  # 視聴可能なエピソードを取得する
  #
  # @param [String] series_id: シリーズID
  def available_episode_from_series(series_id, query: {})
    url = "/#{version}/l/tvepisode/ts/#{series_id}.json?#{INTERNAL_PARAMS.merge(query).to_query}"
    res = client.get url
    return if res.status == 404 # 視聴可能なエピソードが存在しない場合404として処理されるためその対応

    handle_response(response: res, url: url)
  end
end
