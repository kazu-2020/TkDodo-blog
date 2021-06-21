# frozen_string_literal: true

class AddTotalTimeAndEpisodeTime < ActiveRecord::Migration[6.0]
  def change
    add_column :playlist_episodes, :duration, :integer, after: :position, comment: 'エピソードの再生時間'
    add_column :playlists, :total_time, :integer, after: :playlist_episodes_count, default: 0, comment: 'プレイリストの総時間'
  end
end
