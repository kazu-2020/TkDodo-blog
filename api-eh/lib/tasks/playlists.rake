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

  desc 'プレイリストの SubType カウントの集計'
  task update_subtypes: :environment do
    Playlist.all.each do |playlist|
      playlist.assign_sub_type_count
      playlist.save
    end
  end

  desc '記事中に含まれる GitHub Pages のURLを書き換える One-Shot Job'
  task replace_article_url: :environment do
    Playlist.all.each(&:replace_article_body_urls)
  end

  desc '記事中に含まれるエピソードのアイキャッチを更新'
  task refresh_article_body_episode_data: :environment do
    Playlist.all.each(&:refresh_article_body_episode_data).each(&:save)
  end
end
