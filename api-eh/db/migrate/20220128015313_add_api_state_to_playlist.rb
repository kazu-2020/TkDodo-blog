class AddApiStateToPlaylist < ActiveRecord::Migration[6.1]
  def change
    add_column :playlists, :api_state, :integer, null: false, default: 0, after: :published_state, comment: 'APIの公開状態 close: 0, open: 1, waiting: 2'
    rename_column :playlists, :reserve_publish_time_at, :open_scheduled_at
    rename_column :playlists, :reserve_finish_time_at, :close_scheduled_at
  end
end
