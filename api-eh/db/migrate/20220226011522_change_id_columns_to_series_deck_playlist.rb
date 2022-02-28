class ChangeIdColumnsToSeriesDeckPlaylist < ActiveRecord::Migration[6.1]
  def up
    change_column :series_deck_playlists, :series_deck_id, :bigint
    change_column :series_deck_playlists, :series_playlist_id, :bigint

    add_foreign_key :series_deck_playlists, :series_decks, column: :series_deck_id
    add_foreign_key :series_deck_playlists, :series_playlists, column: :series_playlist_id
  end

  def down
    change_column :series_deck_playlists, :series_deck_id, :integer
    change_column :series_deck_playlists, :series_playlist_id, :integer

    remove_foreign_key :series_deck_playlists, column: :series_deck_id
    remove_foreign_key :series_deck_playlists, column: :series_playlist_id
  end
end
