# frozen_string_literal: true

class DeletePlaylistArticle < ActiveRecord::Migration[6.0]
  def change
    remove_column :playlist_article_images, :playlist_article_id, :references, null: false, foreign_key: true

    drop_table :playlist_articles do |t|
      t.integer 'playlist_id', null: false, comment: 'Playlist ID'
      t.text 'marked_header', comment: 'ヘッダー'
      t.json 'editor_data', comment: 'editorのjsonデータ'
      t.text 'article_body', size: :medium, comment: '記事本文'
      t.text 'marked_body', size: :medium, comment: '記事本文（マークダウン）'
      t.text 'marked_footer', comment: 'フッター'

      t.timestamps null: false
    end
  end
end
