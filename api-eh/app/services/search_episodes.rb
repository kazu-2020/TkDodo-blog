class SearchEpisodes
  def call(client, search_params)
    episode(client, search_params)
  end

  private

  def episode(client, search_params)
    result = client.search(merged_params: search_params,
                           query: { publishLevel: 'notyet,ready,full,limited,gone' })&.deep_symbolize_keys
    # okushibu3のために、r6.0からEpisodeを引き直して検索結果に設定し直している
    result.dig(:result, :tvepisode, :result).each do |episode|
      episode[:videos] = PlaylistItem.new(episode_id: episode[:id]).fetch_episode_videos_data
    end

    result
  end
end
