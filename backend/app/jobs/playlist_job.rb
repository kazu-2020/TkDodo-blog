# frozen_string_literal: true

class PlaylistJob < ApplicationJob
  class_timeout 300 # seconds

  def delete_all_playlists
    Playlist.destroy_all
  end

  def recalculate_playlist_item_duration
    PlaylistItem.all.each(&:fetch_data)
  end

  cron '00 3 28 1 ? 2021' # 2021/01/28 12:00に実行 FIXME: 一時的なバッチ処理
  def tmp_article_bodies_regenerate
    Playlist.find_each do |pl|
      pl.set_bodies
      pl.save!
    end
  end
end
