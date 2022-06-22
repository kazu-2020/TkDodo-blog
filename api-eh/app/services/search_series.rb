class SearchSeries
  DEFAULT_OFFSET = 0
  DEFAULT_SIZE = 10
  DEFAULT_TYPE = 'tvseries'.freeze
  DEFAULT_SORT_ORDER = 'desc'.freeze
  DEFAULT_SORT_ORDER_BY = 'recentEvent'.freeze
  DEFAULT_ENVIRONMENT = 'okushibu'.freeze
  QUERY_KEYS = %i[word concern keyword service].freeze

  # @param [DlabApiBase] client: DlabApiClient
  # @param [Hash] search_params
  def call(client, search_params)
    return episode_from_series(client, search_params) if search_params[:series_id].present?

    series(client, search_params)
  end

  private

  # シリーズとシリーズ毎のエピソードを検索する
  #
  # @param [DlabApiBase] client: DlabApiClient
  # @param [Hash] search_params
  def series(client, search_params)
    merged_params = merge_params(search_params)
    merged_params.delete(:orderBy)
    result = client.search(query: merged_params.merge({ publishLevel: 'notyet,ready,full,limited,gone' }))
               &.deep_symbolize_keys
    search_episodes_each_series(result, search_params, client)
  end

  # シリーズ毎のエピソードと視聴可能なエピソードを検索する
  #
  # @param [Hash] result
  # @param [Hash] search_params
  # @param [DlabApiBase] client: DlabApiClient
  def search_episodes_each_series(result, search_params, client) # rubocop: disable Metrics/AbcSize, Style/CommentedKeyword
    search_params[:offset] = 0
    result.dig(:result, :tvseries, :result).each do |series|
      res = client.episode_from_series(query: merge_params(search_params), type: 'tv', series_id: series[:id],
                                       request_type: :l)
      series.store(:episodes, res)
      res = client.available_episode_from_series(series[:id],
                                                 query: { availableOn: DEFAULT_ENVIRONMENT, extendedEntities: true })
      series.store(:availableEpisodes, res)
      # okushibu3のために、r6.0からEpisodeを引き直して検索結果に設定し直している
      series.dig(:episodes, :result).each do |episode|
        episode[:videos] = PlaylistItem.new(episode_id: episode[:id]).fetch_episode_videos_data
      end
    end

    result
  end

  # シリーズ毎のエピソードを検索する
  #
  # @param [DlabApiBase] client: DlabApiClient
  # @param [Hash] search_params
  def episode_from_series(client, search_params)
    merged_params = merge_params(search_params)
    episode = client.episode_from_series(query: merged_params, type: 'tv', series_id: search_params[:series_id],
                                         request_type: :l)&.deep_symbolize_keys
    # okushibu3のために、r6.0からEpisodeを引き直して検索結果に設定し直している
    episode[:videos] = PlaylistItem.new(episode_id: episode[:id]).fetch_episode_videos_data

    episode
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

  # クエリをマージする
  #
  # @param [Hash] search_params
  def search_query_hash(search_params)
    merged_params = {}
    search_params.each_key do |k|
      next unless QUERY_KEYS.include?(k.to_sym)

      if k.to_s.eql?('service') && search_params[k.to_sym].present?
        merged_params.merge!(vService: search_params[k.to_sym])
      else
        merged_params.merge!("#{k}": search_params[k.to_sym])
      end
    end

    merged_params
  end
end
