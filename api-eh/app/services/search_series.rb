class SearchSeries
  def call(client, search_params)
    return episode_from_series(client, search_params) if search_params[:series_id].present?

    series(client, search_params)
  end

  private

  def series(client, search_params) # rubocop: disable Metrics/AbcSize,Style/CommentedKeyword
    result = client.search(search_params: search_params,
                           query: { publishLevel: 'notyet,ready,full,limited,gone' })&.deep_symbolize_keys

    result.dig(:result, :tvseries, :result).each do |series|
      res = client.episode_from_series(search_params: search_params, type: 'tv', series_id: series[:id],
                                       request_type: :l)
      series.store(:episodes, res)

      res = client.available_episode_from_series(series[:id])
      series.store(:availableEpisodes, res)

      # okushibu3のために、r6.0からEpisodeを引き直して検索結果に設定し直している
      series.dig(:episodes, :result).each do |episode|
        episode[:videos] = PlaylistItem.new(episode_id: episode[:id]).fetch_episode_videos_data
      end
    end
    result
  end

  def episode_from_series(client, search_params)
    client.episode_from_series(search_params: search_params, type: 'tv', series_id: search_params[:series_id],
                               request_type: :l)&.deep_symbolize_keys
  end
end
