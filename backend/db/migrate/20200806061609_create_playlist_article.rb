# frozen_string_literal: true

class CreatePlaylistArticle < ActiveRecord::Migration[6.0]
  def change
    create_table :playlist_articles do |t|
      t.integer :playlist_id, null: false, comment: 'Playlist ID'
      t.text :body, comment: '記事本体'

      t.timestamps
    end
  end
end
