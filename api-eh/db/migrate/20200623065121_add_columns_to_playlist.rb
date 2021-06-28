# frozen_string_literal: true

class AddColumnsToPlaylist < ActiveRecord::Migration[6.0]
  def change
    rename_column :playlists, :title, :name
    add_column :playlists, :name_ruby, :string, after: :name, comment: '名前のルビ（ふりがな）'
    add_column :playlists, :description, :text, after: :name_ruby, comment: '説明'
    add_column :playlists, :headline, :text, after: :description, comment: '見出し'
    add_column :playlists, :keyword, :string, after: :headline, comment: 'キーワード'
    add_column :playlists, :hashtag, :string, after: :keyword, comment: 'ハッシュタグ'
    add_column :playlists, :selected_palette, :string, after: :hashtag, comment: '指定カラー'
    add_column :playlists, :primary_light_color, :string, after: :selected_palette, comment: 'ライトモード主カラー'
    add_column :playlists, :primary_dark_color, :string, after: :primary_light_color, comment: 'ダークモード主カラー'
    add_column :playlists, :text_light_color, :string, after: :primary_dark_color, comment: 'ライトモードテキストカラー'
    add_column :playlists, :text_dark_color, :string, after: :text_light_color, comment: 'ダークモードテキストカラー'
    add_column :playlists, :link_light_color, :string, after: :text_dark_color, comment: 'ライトモードリンクカラー'
    add_column :playlists, :link_dark_color, :string, after: :link_light_color, comment: 'ダークモードリンクカラー'
    add_column :playlists, :string_id, :string, after: :link_dark_color, comment: 'プレイリスト文字列ID'
    add_column :playlists, :published_state, :string, after: :string_id, default: 'draft', null: false, comment: '公開状態'
    add_column :playlists, :reserved_publish_date, :datetime, after: :published_state, comment: '予約公開日'

    add_index :playlists, :string_id, unique: true
  end
end
