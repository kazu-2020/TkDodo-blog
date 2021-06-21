# frozen_string_literal: true

class AddPlayableTotalTimeToPlaylists < ActiveRecord::Migration[6.0]
  def change
    add_column :playlists, :playable_playlist_items_count, :integer, default: 0,
                after: :playlist_items_count, comment: '再生可能なエピソード数'
    add_column :playlists, :playable_total_time, :integer, default: 0, after: :total_time, comment: 'プレイリスト再生可能時間'
  end
end
