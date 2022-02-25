class RenameAvailableActicleToPlaylist < ActiveRecord::Migration[6.1]
  def up
    rename_column :playlists, :available_acticle, :available_article
    change_column_comment :playlists, :available_article, 'article が available かどうか'
  end

  def down
    rename_column :playlists, :available_article, :available_acticle
    change_column_comment :playlists, :available_acticle, 'artilce が available かどうか'
  end
end
