class AddArticleColumnsToPlaylistArticle < ActiveRecord::Migration[6.0]
  def up
    rename_column :playlist_articles, :body, :editor_data
    change_column :playlist_articles, :editor_data, :json, comment: "editorのjsonデータ"

    rename_column :playlist_articles, :header, :marked_header
    change_column :playlist_articles, :marked_header, :text, comment: "ヘッダー"

    rename_column :playlist_articles, :footer, :marked_footer
    change_column :playlist_articles, :marked_footer, :text, comment: "フッター"

    add_column :playlist_articles, :article_body, :text, size: :medium, after: :editor_data, comment: "記事本文"
    add_column :playlist_articles, :marked_body, :text, size: :medium, after: :article_body, comment: "記事本文（マークダウン）"
  end

  def down
    rename_column :playlist_articles, :editor_data, :body
    change_column :playlist_articles, :body, :text, comment: "記事本体"

    rename_column :playlist_articles, :marked_header, :header
    change_column :playlist_articles, :header, :string, comment: "ヘッダー"

    rename_column :playlist_articles, :marked_footer, :footer
    change_column :playlist_articles, :footer, :string, comment: "フッター"

    remove_column :playlist_articles, :article_body
    remove_column :playlist_articles, :marked_body
  end
end
