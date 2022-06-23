class SearchEpisodes
  DEFAULT_OFFSET = 0
  DEFAULT_SIZE = 10
  DEFAULT_TYPE = 'tvepisode'.freeze
  DEFAULT_SORT_ORDER = 'desc'.freeze
  DEFAULT_SORT_ORDER_BY = 'score'.freeze
  QUERY_KEYS = %i[word concern keyword service].freeze

  def call(client, search_params)
    episode(client, search_params)
  end

  private

  def episode(client, search_params)
    merged_params = merge_params(search_params)

    result = client.search(query: merged_params.merge({ publishLevel: 'notyet,ready,full,limited,gone' }))
               &.deep_symbolize_keys
    # okushibu3のために、r6.0からEpisodeを引き直して検索結果に設定し直している
    result.dig(:result, :tvepisode, :result).each do |episode|
      episode[:videos] = PlaylistItem.new(episode_id: episode[:id]).fetch_episode_videos_data
    end

    result
  end

  # パラメータをマージする
  #
  # @param [Hash] search_params
  def merge_params(search_params)
    offset = search_params[:offset] || DEFAULT_OFFSET
    ignore_range = search_params[:ignore_range].nil? ? true : search_params[:ignore_range]
    sort_order = search_params[:order] || DEFAULT_SORT_ORDER
    sort_order_by = search_params[:order_by] || DEFAULT_SORT_ORDER_BY
    size = search_params[:size] || DEFAULT_SIZE
    type = search_params[:contents_type] || DEFAULT_TYPE
    merged_params = { offset: offset, isFuzzy: true, ignoreRange: ignore_range,
                      order: sort_order, orderBy: sort_order_by, size: size, type: type }
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
