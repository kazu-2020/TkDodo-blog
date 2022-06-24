class SearchPlaylists
  DEFAULT_OFFSET = 0
  DEFAULT_SIZE = 10
  DEFAULT_TYPE = 'nplaylist'.freeze
  DEFAULT_SORT_ORDER = 'desc'.freeze
  DEFAULT_SORT_ORDER_BY = 'score'.freeze
  DEFAULT_TYPE_OF_LIST = 'recommend'.freeze
  DEFAULT_MODE_OF_ITEM = 'tv'.freeze
  QUERY_KEYS = %i[contents_type size offset mode_of_item type_of_list order order_by word concern keyword
                  vService].freeze
  DEFAULT_PARAMS = { offset: DEFAULT_OFFSET, size: DEFAULT_SIZE, contents_type: DEFAULT_TYPE,
                     order: DEFAULT_SORT_ORDER, order_by: DEFAULT_SORT_ORDER_BY, type_of_list: DEFAULT_TYPE_OF_LIST,
                     mode_of_item: DEFAULT_MODE_OF_ITEM }.freeze

  # @param [DlabApiClient] client: PocApiClient
  # @param [Hash] search_params
  def call(client, search_params)
    search_query_hash = convert_to_search_query(search_params)
    if search_params[:playlist_id].present?
      return episode_from_playlist(client, search_query_hash,
                                   search_params[:playlist_id])
    end

    playlists = playlists(client, search_query_hash)
    search_episodes_each_playlist(playlists, client, search_query_hash)
  end

  private

  # プレイリスト一覧を取得する
  #
  # @param [DlabApiBase] client: PocApiClient
  # @param [Hash] search_query_hash
  def playlists(client, search_query_hash)
    client.search(query: search_query_hash)
      &.deep_symbolize_keys
  end

  # プレイリスト毎のエピソードを検索する
  #
  # @param [Hash] playlists
  # @param [DlabApiBase] client: PocApiClient
  # @param [Hash] search_query_hash
  def search_episodes_each_playlist(playlists, client, search_query_hash)
    search_query_hash[:offset] = 0
    playlists.dig(:result, :nplaylist, :result).each do |playlist|
      res = client.episode_from_playlist(query: search_query_hash, playlist_id: playlist[:id])
      playlist.store(:episodes, res)

      res = client.available_episode_from_playlist(playlist[:id])
      playlist.store(:availableEpisodes, res)
    end
    playlists
  end

  # プレイリスト毎のエピソードを検索する
  #
  # @param [DlabApiBase] client: PocApiClient
  # @param [Hash] search_query_hash
  # @param [number]
  def episode_from_playlist(client, search_query_hash, playlist_id)
    client.episode_from_playlist(query: search_query_hash, playlist_id: playlist_id)
  end

  # 検索パラメータをAPI検索に使用するqueryに変換する
  #
  # @param [Hash] search_params
  # @return [Hash]
  def convert_to_search_query(search_params)
    filtered_search_params = search_params.select { |k, v| QUERY_KEYS.include?(k.to_sym) && v.present? }
    merged_with_default_params = DEFAULT_PARAMS.merge(filtered_search_params,
                                                      { publishLevel: 'notyet,ready,full,limited,gone', isFuzzy: true })
    merged_with_default_params.transform_keys do |k|
      k = :type if k.eql? :contents_type
      k.to_s.camelize(:lower).to_sym
    end
  end
end
