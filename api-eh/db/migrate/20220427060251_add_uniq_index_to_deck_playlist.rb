class AddUniqIndexToDeckPlaylist < ActiveRecord::Migration[6.1]
  def change
    add_index :deck_playlists, [:deck_id, :playlist_id], unique: true
  end
end
