namespace :playlists do
  desc 'プレイリストの再生時間や再生可能エピソード数の更新'
  task recalculate_playlist_item_duration: :environment do
    PlaylistItem.kept.all.each(&:fetch_data)

    Playlist.all.each do |playlist|
      playlist.update_playable_total_time!
      playlist.update_playable_playlist_items_count!
    end
  end

  desc 'r5 プレイリストの取り込み'
  task import_r5_playlists: :environment do
    R5PlaylistsImporter.new.execute
  end
end
