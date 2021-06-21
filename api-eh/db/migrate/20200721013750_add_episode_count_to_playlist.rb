# frozen_string_literal: true

class AddEpisodeCountToPlaylist < ActiveRecord::Migration[6.0]
  def change
    add_column :playlists, :playlist_episodes_count, :integer, default: 0, null: false, after: :d5_playlist_id, comment: 'エピソード数'
  end
end
