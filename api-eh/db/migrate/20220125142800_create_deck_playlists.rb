class CreateDeckPlaylists < ActiveRecord::Migration[6.1]
  def up
    create_table :deck_playlists do |t|
      t.integer :deck_id, null: false, comment: 'Deck ID'
      t.integer :playlist_id, null: false, comment: 'Playlist ID'
      t.integer :position, null: false, default: 1

      t.timestamps
    end
    add_index :deck_playlists, :deck_id
  end

  def down
    add_column :playlists, :deck_id, :integer, after: :string_id, comment: 'デッキID'
    drop_table :deck_playlists
  end
end
