class RemovePublishedStateToPlaylist < ActiveRecord::Migration[6.1]
  def change
    remove_column :playlists, :published_state, :string, null: false, default: 'draft'
  end
end
