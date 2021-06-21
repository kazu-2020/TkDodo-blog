class CreatePlaylistEpisodes < ActiveRecord::Migration[6.0]
  def change
    create_table :playlist_episodes do |t|
      t.integer :playlist_id, null: false
      t.string  :episode_id,  null: false
      t.integer :position,    null: false, default: 1

      t.timestamps
    end

    add_index :playlist_episodes, :playlist_id, name: 'idx_playlist_id'
  end
end
