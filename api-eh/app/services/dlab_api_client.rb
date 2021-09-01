# frozen_string_literal: true

class DlabApiClient < DlabApiBase
  API_ENDPOINT =
    if Rails.env.development? || Rails.env.test? || Rails.env.staging?
      'https://dev-api.nr.nhk.jp'
    elsif Rails.env.production?
      'https://api.nr.nhk.jp'
    else
      'dummy'
    end

  VERSION = 'r6'
  INTERNAL_PARAMS = { extendedEntities: true, ignoreRange: true }.freeze
  DEFAULT_OFFSET = 0
  DEFAULT_SIZE = 10
  DEFAULT_SORT_ORDER = 'desc'
  DEFAULT_SORT_ORDER_BY = 'score'

  def initialize(api_endpoint: nil)
    super()
    @api_endpoint = api_endpoint || API_ENDPOINT
  end

  # TVEpisode 検索APIをリクエストする
  #
  # @param [Hash] search_params
  def search(search_params)
    offset = search_params[:offset] || DEFAULT_OFFSET
    ignore_range = search_params[:ignore_range].nil? ? true : search_params[:ignore_range]
    sort_order = search_params[:order] || DEFAULT_SORT_ORDER
    sort_order_by = search_params[:order_by] || DEFAULT_SORT_ORDER_BY
    size = search_params[:size] || DEFAULT_SIZE
    merged_params = { type: 'TVEpisode', offset: offset, isFuzzy: true, ignoreRange: ignore_range,
                      order: sort_order, orderBy: sort_order_by, size: size }
    merged_params.merge!(search_query_hash(search_params))

    res = client.get "/#{VERSION}/s/extended.json", INTERNAL_PARAMS.merge(merged_params)
    handle_response(res)
  end

  # TVEpisode に紐づくサブタイプの数をリクエストする
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] episode_id: エピソードID
  def episode_list_bundle(type:, episode_id:, query: {})
    res = client.get "/#{VERSION}/l/bundle/#{type.downcase.first}e/#{episode_id}/types.json",
                     INTERNAL_PARAMS.merge(query)
    handle_response(res)
  end

  # Episode データ一式をリクエストする
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] episode_id: エピソードID
  # @param [Hash] query
  def episode_bundle(type:, episode_id:, query: {})
    res = client.get "/#{VERSION}/t/bundle/#{type.downcase.first}e/#{episode_id}.json", INTERNAL_PARAMS.merge(query)
    handle_response(res)
  end

  # Episode データをリクエストする
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] episode_id: エピソードID
  # @param [Hash] query
  def episode(type:, episode_id:, query: {})
    res = client.get "/#{VERSION}/t/tvepisode/#{type.downcase.first}e/#{episode_id}.json", INTERNAL_PARAMS.merge(query)
    handle_response(res)
  end

  # Series データ一式をリクエストする
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] series_id: シリーズID
  def series_bundle(type:, series_id:, query: {})
    res = client.get "/#{VERSION}/t/bundle/#{type.downcase.first}s/#{series_id}.json", INTERNAL_PARAMS.merge(query)
    handle_response(res)
  end

  # Series データをリクエストする
  #
  # @param [String] type: 'tv' or 'radio'
  # @param [String] series_id: シリーズID
  def series(type:, series_id:)
    res = client.get "/#{VERSION}/t/tvseries/#{type.downcase.first}s/#{series_id}.json", INTERNAL_PARAMS
    handle_response(res)
  end

  # エピソードをシリーズ指定で取得する
  #
  # @param [String] type: 'tvepisode' or 'radioepisode'
  # @param [String] series_id: シリーズID
  # @param [String] request_type: t or l
  def episode_from_series(type:, series_id:, request_type: :t, query: {})
    res = client.get "/#{VERSION}/#{request_type}/#{type.downcase}episode/ts/#{series_id}.json",
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

  # Howto データをリクエストする
  #
  # @param [String] episode_id: TVEpisode id
  def episode_howto(episode_id:)
    res = client.get "/#{VERSION}/l/howto/te/#{episode_id}.json?size=100", INTERNAL_PARAMS
    handle_response(res)
  end

  # Event データをリクエストする
  #
  # @param [String] event_id: イベントID
  def event(event_id:)
    res = client.get "/#{VERSION}/t/event/id/#{event_id}.json", INTERNAL_PARAMS
    handle_response(res)
  end

  # Event データをリクエストする
  #
  # @param [String] episode_id: TVEpisode id
  def episode_event(episode_id:)
    res = client.get "/#{VERSION}/l/event/te/#{episode_id}.json?size=100", INTERNAL_PARAMS
    handle_response(res)
  end

  # FAQPage データをリクエストする
  #
  # @param [String] faq_page_id: FAQPage ID
  def faq_page(faq_page_id:)
    res = client.get "/#{VERSION}/t/faqpage/id/#{faq_page_id}.json", INTERNAL_PARAMS
    handle_response(res)
  end

  # FAQPage データをリクエストする
  #
  # @param [String] episode_id: TVEpisode id
  def episode_faq_page(episode_id:)
    res = client.get "/#{VERSION}/l/faqpage/te/#{episode_id}.json?size=100", INTERNAL_PARAMS
    handle_response(res)
  end

  private

  def search_query_hash(search_params)
    merged_params = {}
    merged_params.merge!(word: search_params[:word]) if search_params[:word].present?
    merged_params.merge!(concern: search_params[:concern]) if search_params[:concern].present?
    merged_params.merge!(keyword: search_params[:keyword]) if search_params[:keyword].present?
    merged_params.merge!(service: search_params[:service]) if search_params[:service].present?
    merged_params
  end

  attr_reader :api_endpoint
end
