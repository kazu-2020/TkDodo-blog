namespace :playlist_items do
  desc 'エピソードの参照状態により論理削除切り替え'
  task change_status_of_zombified_and_respawned_episodes: :environment do
    client = DlabApiClient.new
    playlist_items = PlaylistItem.all

    playlist_items.each do |playlist_item|
      if playlist_item.discarded?
        begin
          client.episode(type: 'tv', episode_id: playlist_item.episode_id)
          playlist_item.undiscard
        rescue DlabApiClient::NotFound
          # NotFound なら引き続き discarded 状態
        end
      else
        begin
          client.episode(type: 'tv', episode_id: playlist_item.episode_id)
        rescue DlabApiClient::NotFound
          playlist_item.discard
        end
      end
    end
  end
end
