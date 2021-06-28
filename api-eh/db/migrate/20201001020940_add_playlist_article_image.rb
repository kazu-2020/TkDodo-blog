# frozen_string_literal: true

class AddPlaylistArticleImage < ActiveRecord::Migration[6.0]
  def change
    create_table :playlist_article_images do |t|
      t.references :playlist_article, null: false, foreign_key: true
      t.text :image_data

      t.timestamps
    end
  end
end
