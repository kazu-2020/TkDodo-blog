class CreateSeriesDeckPlaylist < ActiveRecord::Migration[6.1]
  def change
    create_table :series_deck_playlists do |t|
      t.integer "series_deck_id", null: false, comment: "シリーズデッキID"
      t.integer "series_playlist_id", null: false, comment: "シリーズプレイリストID"
      t.integer "position", default: 1, null: false

      t.timestamps
    end

    add_index :series_deck_playlists, [:series_deck_id, :series_playlist_id], name: "index_series_deck_and_playlist_id", unique: true
    add_index :series_deck_playlists, [:series_playlist_id, :position]
  end
end
