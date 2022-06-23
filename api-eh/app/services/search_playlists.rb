class SearchPlaylists
  DEFAULT_OFFSET = 0
  DEFAULT_SIZE = 10
  DEFAULT_TYPE = 'nplaylist'.freeze
  DEFAULT_SORT_ORDER = 'desc'.freeze
  DEFAULT_SORT_ORDER_BY = 'score'.freeze
  DEFAULT_TYPE_OF_LIST = 'recommend'.freeze
  DEFAULT_MODE_OF_ITEM = 'tv'.freeze
  QUERY_KEYS = %i[word concern keyword vService].freeze

  # @param [DlabApiClient] client: PocApiClient
  # @param [Hash] search_params
  def call(client, search_params)
    episodes_in_playlist(client, search_params)
  end

  private

  # プレイリストとプレイリスト毎のエピソードを検索する
  #
  # @param [DlabApiBase] client: PocApiClient
  # @param [Hash] search_params
  def episodes_in_playlist(client, search_params)
    merged_search_params = merge_params(search_params)

    client.search(query: merged_search_params.merge({ publishLevel: 'notyet,ready,full,limited,gone' }))
      &.deep_symbolize_keys
  end

  # パラメータをマージする
  #
  # @param [Hash] search_params
  def merge_params(search_params) # rubocop: disable  Metrics/CyclomaticComplexity, Style/CommentedKeyword
    type = search_params[:contents_type] || DEFAULT_TYPE

    offset = search_params[:offset] || DEFAULT_OFFSET
    mode_of_item = search_params[:mode_of_item] || DEFAULT_MODE_OF_ITEM
    type_of_list = search_params[:type_of_list] || DEFAULT_TYPE_OF_LIST
    sort_order = search_params[:order] || DEFAULT_SORT_ORDER
    sort_order_by = search_params[:order_by] || DEFAULT_SORT_ORDER_BY
    size = search_params[:size] || DEFAULT_SIZE
    merged_params = { type: type, offset: offset, isFuzzy: true, modeOfItem: mode_of_item,
                      typeOfList: type_of_list, order: sort_order, orderBy: sort_order_by, size: size }
    merged_params.merge!(search_query_hash(search_params))

    merged_params
  end

  # クエリをマージする
  #
  # @param [Hash] search_params
  def search_query_hash(search_params)
    search_params.select { |k, v| QUERY_KEYS.include?(k.to_sym) && v.present? }
  end
end
