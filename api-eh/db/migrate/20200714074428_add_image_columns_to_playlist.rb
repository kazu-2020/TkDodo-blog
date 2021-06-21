class AddImageColumnsToPlaylist < ActiveRecord::Migration[6.0]
  def change
    add_column :playlists, :logo_image_data, :text, after: :headline, comment: 'ロゴ画像データ'
    add_column :playlists, :eyecatch_image_data, :text, after: :headline, comment: 'アイキャッチ画像データ'
    add_column :playlists, :hero_image_data, :text, after: :headline, comment: 'ヒーローイメージ画像データ'
  end
end
