# frozen_string_literal: true

class PlaylistJob < ApplicationJob
  class_timeout 300 # seconds

  def delete_all_playlists
    Playlist.destroy_all
  end

  rate '1 day'
  def recalculate_playlist_item_duration
    PlaylistItem.kept.all.each(&:fetch_data)

    Playlist.all.each do |playlist|
      playlist.update_playable_total_time!
      playlist.update_playable_playlist_items_count!
    end
  end

  cron '00 4 1 3 ? 2021' # 2021/03/01 13:00に実行 FIXME: 一時的なバッチ処理
  def tmp_article_bodies_regenerate
    Playlist.find_each do |pl|
      pl.set_bodies
      pl.save!
    end
  end
end
