# frozen_string_literal: true

class RenamePlaylistEpisodes < ActiveRecord::Migration[6.0]
  def change
    rename_table :playlist_episodes, :playlist_items
    rename_column :playlists, :playlist_episodes_count, :playlist_items_count
  end
end
