class ChangeIdColumnsToArticleImage < ActiveRecord::Migration[6.1]
  def up
    change_column :article_images, :playlist_id, :bigint

    add_foreign_key :article_images, :playlists
  end

  def down
    change_column :article_images, :playlist_id, :integer

    remove_foreign_key :article_images, :playlists
  end
end
