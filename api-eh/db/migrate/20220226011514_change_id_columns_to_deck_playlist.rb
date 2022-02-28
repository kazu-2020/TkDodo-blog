class ChangeIdColumnsToDeckPlaylist < ActiveRecord::Migration[6.1]
  def up
    change_column :deck_playlists, :deck_id, :bigint
    change_column :deck_playlists, :playlist_id, :bigint

    add_foreign_key :deck_playlists, :decks
    add_foreign_key :deck_playlists, :playlists
  end

  def down
    change_column :deck_playlists, :deck_id, :integer
    change_column :deck_playlists, :playlist_id, :integer

    remove_foreign_key :deck_playlists, :decks
    remove_foreign_key :deck_playlists, :playlists
  end
end
