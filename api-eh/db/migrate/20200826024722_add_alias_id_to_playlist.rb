class AddAliasIdToPlaylist < ActiveRecord::Migration[6.0]
  def change
    add_column :playlists, :alias_id, :string, after: :original_series_id, comment: '短縮URL'
    add_index :playlists, :alias_id, unique: true
  end
end
