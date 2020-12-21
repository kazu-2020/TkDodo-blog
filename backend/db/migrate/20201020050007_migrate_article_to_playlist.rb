# frozen_string_literal: true

class MigrateArticleToPlaylist < ActiveRecord::Migration[6.0]
  def up
    add_column :playlists, :marked_header, :text, after: :total_time, comment: 'ヘッダー'
    add_column :playlists, :article_body, :text, size: :medium, after: :marked_header, comment: '記事本文'
    add_column :playlists, :marked_body, :text, size: :medium, after: :article_body, comment: '記事本文（マークダウン）'
    add_column :playlists, :marked_footer, :text, after: :marked_body, comment: 'フッター'
    add_column :playlists, :editor_data, :json, after: :marked_footer, comment: 'editorのjsonデータ'

    add_column :playlist_article_images, :playlist_id,
               :integer, unsigned: true, null: false, after: :id, comment: 'プレイリストID'
    change_column_null :playlist_article_images, :playlist_article_id, true, nil

    add_index :playlist_article_images, :playlist_id
  end

  def down
    remove_column :playlists, :marked_header, :text
    remove_column :playlists, :article_body, :text
    remove_column :playlists, :marked_body, :text
    remove_column :playlists, :marked_footer, :text
    remove_column :playlists, :editor_data, :json

    remove_index :playlist_article_images, :playlist_id

    remove_column :playlist_article_images, :playlist_id, :integer
    change_column_null :playlist_article_images, :playlist_article_id, false, 0
  end
end
