# frozen_string_literal: true

class RenamePlaylistArticleImage < ActiveRecord::Migration[6.0]
  def change
    rename_table :playlist_article_images, :article_images
  end
end
