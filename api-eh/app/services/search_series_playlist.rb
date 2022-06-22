class SearchSeriesPlaylist
  DEFAULT_OFFSET = 0
  DEFAULT_SIZE = 10
  DEFAULT_TYPE = 'tvseries'.freeze
  QUERY_KEYS = %i[word concern keyword].freeze

  # @param [DlabApiBase] client: DlabApiClient
  # @param [Hash] search_params
  def call(client, search_params)
    series_playlist(client, search_params)
  end

  private

  # シリーズとシリーズ毎のエピソードを検索する
  #
  # @param [DlabApiBase] client: DlabApiClient
  # @param [Hash] search_params
  def series_playlist(client, search_params)
    client.search(query: merge_params(search_params).merge({ publishLevel: 'notyet,ready,full,limited,gone' }))
      &.deep_symbolize_keys
  end

  # パラメータをマージする
  #
  # @param [Hash] search_params
  def merge_params(search_params)
    offset = search_params[:offset] || DEFAULT_OFFSET
    size = search_params[:size] || DEFAULT_SIZE
    type = search_params[:contents_type] || DEFAULT_TYPE
    merged_params = { type: type, offset: offset, size: size }
    merged_params.merge!(search_query_hash(search_params))

    merged_params
  end

  # QUERY_KEYSに該当するクエリを検索パラメータから抽出する
  #
  # @param [Hash] search_params
  def search_query_hash(search_params)
    search_params.select { |k, v| QUERY_KEYS.include?(k.to_sym) && v.present? }
  end
end
