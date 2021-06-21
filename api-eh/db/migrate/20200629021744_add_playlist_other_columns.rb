# frozen_string_literal: true

class AddPlaylistOtherColumns < ActiveRecord::Migration[6.0]
  def change
    add_column :playlists, :detailed_catch, :string, after: :keyword, comment: 'キャッチコピー'
    add_column :playlists, :format_genre_code, :string, after: :hashtag, comment: 'ジャンル（フォーマット）'
    add_column :playlists, :theme_genre_code, :string, after: :format_genre_code, comment: 'ジャンル（テーマ）'
    add_column :playlists, :published_at, :datetime, after: :reserved_publish_date, comment: '公開日時'

    rename_column :playlists, :reserved_publish_date, :reserve_publish_time_at
    add_column :playlists, :reserve_finish_time_at, :datetime, after: :reserve_publish_time_at, comment: '公開終了日時'
  end
end
