# frozen_string_literal: true

class AddDeckTable < ActiveRecord::Migration[6.0]
  def change
    create_table :decks do |t|
      t.string :name
      t.string :area

      t.timestamps
    end

    add_column :playlists, :deck_id, :integer, after: :string_id, comment: 'デッキID'
    add_column :playlists, :d5_playlist_id, :string, after: :original_series_id, comment: 'r5 デッキのプレイリストID'
  end
end
