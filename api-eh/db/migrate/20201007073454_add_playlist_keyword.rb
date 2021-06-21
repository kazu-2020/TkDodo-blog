# frozen_string_literal: true

class AddPlaylistKeyword < ActiveRecord::Migration[6.0]
  def change
    create_table :playlist_keywords do |t|
      t.references :playlist, null: false, foreign_key: true
      t.text :name

      t.timestamps
    end

    create_table :playlist_hashtags do |t|
      t.references :playlist, null: false, foreign_key: true
      t.text :name

      t.timestamps
    end

    remove_column :playlists, :keywords, :string
    remove_column :playlists, :hashtag, :string
  end
end
