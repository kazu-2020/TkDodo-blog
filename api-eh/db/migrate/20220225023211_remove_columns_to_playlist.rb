class RemoveColumnsToPlaylist < ActiveRecord::Migration[6.1]
  def change
    remove_column :playlists, :original_series_id, :string
    remove_column :playlists, :deck_id, :string
  end
end
