class AddHeaderFooterToPlaylistArticle < ActiveRecord::Migration[6.0]
  def change
    add_column :playlist_articles, :header, :string, after: :playlist_id, comment: 'ヘッダー'
    add_column :playlist_articles, :footer, :string, after: :body, comment: 'フッター'
  end
end
