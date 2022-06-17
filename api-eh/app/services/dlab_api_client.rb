# frozen_string_literal: true

class DlabApiClient < DlabApiBase
  API_ENDPOINT =
    if Rails.env.development? || Rails.env.dev? || Rails.env.test?
      'https://dev-api.nr.nhk.jp'
    elsif Rails.env.staging?
      'https://stg-api.nr.nhk.jp'
    elsif Rails.env.production?
      'https://api.nr.nhk.jp'
    else
      'dummy'
    end
  VERSION = 'r6'
  INTERNAL_PARAMS = { extendedEntities: true, ignoreRange: true }.freeze
  DEFAULT_OFFSET = 0
  DEFAULT_SIZE = 10
  DEFAULT_TYPE = 'tvepisode'
  DEFAULT_SORT_ORDER = 'desc'
  DEFAULT_SORT_ORDER_BY = 'score'
  DEFAULT_ENVIRONMENT = 'okushibu'

  attr_reader :api_endpoint, :version

  def initialize(api_endpoint: nil, version: nil)
    super()
    @api_endpoint = api_endpoint || API_ENDPOINT
    @version = version || VERSION
  end

  # TVEpisode 検索APIをリクエストする
  #
  # @param [Hash] search_params
  # rubocop: disable Metrics/AbcSize
  # @param [Hash] query
  def search(search_params: {}, query: {})
    offset = search_params[:offset] || DEFAULT_OFFSET
    ignore_range = search_params[:ignore_range].nil? ? true : search_params[:ignore_range]
    sort_order = search_params[:order] || DEFAULT_SORT_ORDER
    sort_order_by = search_params[:order_by] || DEFAULT_SORT_ORDER_BY
    size = search_params[:size] || DEFAULT_SIZE
    type = search_params[:contents_type] || DEFAULT_TYPE
    merged_params = { type: type, offset: offset, isFuzzy: true, ignoreRange: ignore_range,
                      order: sort_order, orderBy: sort_order_by, size: size }
    merged_params.merge!(search_query_hash(search_params))

    res = client.get "/#{version}/s/extended.json", INTERNAL_PARAMS.merge(merged_params).merge(query)
    handle_response(res)
  end
  # rubocop: enable Metrics/AbcSize

  # TVEpisode に紐づくサブタイプの数をリクエストする
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] episode_id: エピソードID
  def episode_list_bundle(type:, episode_id:, query: {})
    res = client.get "/#{version}/l/bundle/#{type.downcase.first}e/#{episode_id}/types.json",
                     INTERNAL_PARAMS.merge(query)
    handle_response(res)
  end

  # Episode データ一式をリクエストする
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] episode_id: エピソードID
  # @param [Hash] query
  def episode_l_bundle(type:, episode_id:, query: {})
    res = client.get "/#{version}/l/bundle/#{type.downcase.first}e/#{episode_id}.json", INTERNAL_PARAMS.merge(query)
    handle_response(res)
  end

  # Episode データをリクエストする
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] episode_id: エピソードID
  # @param [Hash] query
  def episode(type:, episode_id:, query: {})
    res = client.get "/#{version}/t/tvepisode/#{type.downcase.first}e/#{episode_id}.json", INTERNAL_PARAMS.merge(query)
    handle_response(res)
  end

  # Series データをリクエストする
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] series_id: シリーズID
  def series(type:, series_id:)
    res = client.get "/#{version}/t/tvseries/#{type.downcase.first}s/#{series_id}.json", INTERNAL_PARAMS
    handle_response(res)
  end

  # Series タイプ総数一式をリクエストする
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] series_id: シリーズID
  # @param [Hash] query
  def series_ll_bundle_types(type:, series_id:, query: {})
    res = client.get "/#{version}/ll/bundle/#{type.downcase.first}s/#{series_id}/types.json",
                     INTERNAL_PARAMS.merge(query)
    handle_response(res)
  end

  # エピソードをシリーズ指定で取得する
  #
  # @param [Hash] search_params
  # @param [String] type: 'tvepisode' or 'radioepisode'
  # @param [String] series_id: シリーズID
  # @param [String] request_type: t or l
  # rubocop: disable Metrics/AbcSize
  def episode_from_series(type:, series_id:, search_params: {}, request_type: :t, query: {})
    offset = search_params[:offset] || DEFAULT_OFFSET
    ignore_range = search_params[:ignore_range].nil? ? true : search_params[:ignore_range]
    sort_order = search_params[:order] || DEFAULT_SORT_ORDER
    sort_order_by = search_params[:order_by] || 'dateModified' # TODO: 'recentEvent'に切り替えること
    size = search_params[:size] || DEFAULT_SIZE
    merged_params = { offset: offset, isFuzzy: true, ignoreRange: ignore_range,
                      order: sort_order, orderBy: sort_order_by, size: size }
    merged_params.merge!(search_query_hash(search_params))
    res = client.get "/#{version}/#{request_type}/#{type.downcase}episode/ts/#{series_id}.json",
                     INTERNAL_PARAMS.merge(merged_params).merge(query)
    handle_response(res)
  end

  # rubocop: enable Metrics/AbcSize

  # Howto データをリクエストする
  #
  # @param [String] howto_id: ハウツーID
  def howto(howto_id:, query: {})
    res = client.get "/#{version}/t/howto/id/#{howto_id}.json", INTERNAL_PARAMS.merge(query)
    handle_response(res)
  end

  # Event データをリクエストする
  #
  # @param [String] event_id: イベントID
  def event(event_id:, query: {})
    res = client.get "/#{version}/t/event/id/#{event_id}.json", INTERNAL_PARAMS.merge(query)
    handle_response(res)
  end

  # FAQPage データをリクエストする
  #
  # @param [String] faq_page_id: FAQPage ID
  def faq_page(faq_page_id:, query: {})
    res = client.get "/#{version}/t/faqpage/id/#{faq_page_id}.json", INTERNAL_PARAMS.merge(query)
    handle_response(res)
  end

  # 視聴可能なエピソードを取得する
  #
  # @param [String] series_id: シリーズID
  def available_episode_from_series(series_id)
    available_on = DEFAULT_ENVIRONMENT
    extended_entities = true
    res = client.get "/#{version}/l/tvepisode/ts/#{series_id}.json",
                     { availableOn: available_on, extendedEntities: extended_entities }
    JSON.parse(res.body, symbolize_names: true) # 視聴可能なエピソードが存在しない場合404が返却されるためその対応
  end

  private

  # TODO: コードの修正
  # rubocop: disable Metrics/AbcSize
  def search_query_hash(search_params)
    merged_params = {}
    merged_params.merge!(word: search_params[:word]) if search_params[:word].present?
    merged_params.merge!(concern: search_params[:concern]) if search_params[:concern].present?
    merged_params.merge!(keyword: search_params[:keyword]) if search_params[:keyword].present?
    if search_params[:contents_type].eql?('tvseries')
      merged_params.merge!(vService: search_params[:service]) if search_params[:service].present?
    elsif search_params[:service].present?
      merged_params.merge!(service: search_params[:service])
    end
    merged_params
  end

  # rubocop: enable Metrics/AbcSize
end
