class ChangeIdColumnsToPlaylistItems < ActiveRecord::Migration[6.1]
  def up
    change_column :playlist_items, :playlist_id, :bigint

    add_foreign_key :playlist_items, :playlists
  end

  def down
    change_column :playlist_items, :playlist_id, :integer

    remove_foreign_key :playlist_items, :playlists
  end
end
