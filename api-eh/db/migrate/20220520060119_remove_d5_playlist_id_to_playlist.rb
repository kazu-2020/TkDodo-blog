class RemoveD5PlaylistIdToPlaylist < ActiveRecord::Migration[6.1]
  def change
    remove_column :playlists, :d5_playlist_id, :string
  end
end
