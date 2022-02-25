namespace :playlists do
  desc '記事中に含まれる GitHub Pages のURLを書き換える One-Shot Job'
  task replace_article_url: :environment do
    Playlist.all.each(&:replace_article_body_urls)
  end

  desc '記事中に含まれるエピソードのアイキャッチを更新'
  task refresh_article_body_episode_data: :environment do
    Playlist.all.each(&:refresh_article_body_episode_data).each(&:save)
  end

  desc '全てのプレイリストのapi_stateを「公開」に変更する'
  task open_api_state_all: :environment do
    Playlist.update_all(api_state: :open)
  end

  desc 'プレイリストの string_id を生成して保存する'
  task set_string_id: :environment do
    Playlist.all.each(&:save_string_id)
  end

  desc 'プレイリストの available_article を保存する'
  task set_available_article: :environment do
    Playlist.order(updated_at: :asc).each do |playlist|
      playlist.set_available_article
      playlist.save
    end
  end
end
