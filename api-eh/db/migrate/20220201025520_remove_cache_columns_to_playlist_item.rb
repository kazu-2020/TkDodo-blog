class RemoveCacheColumnsToPlaylistItem < ActiveRecord::Migration[6.1]
  def change
    remove_column :playlist_items, :duration, :integer, comment: "エピソードの再生時間"
    remove_column :playlist_items, :has_video, :boolean, comment: "再生可能な動画があるか"
    remove_column :playlist_items, :has_how_to, :boolean, comment: "ハウツー保持フラグ"
    remove_column :playlist_items, :has_event, :boolean, comment: "イベント保持フラグ"
    remove_column :playlist_items, :has_faq_page, :boolean, comment: "FAQ 保持フラグ"
    remove_column :playlist_items, :cached_data, :text, comment: "r6 API からのエピソードJSONのキャッシュ"
    remove_column :playlist_items, :cached_data_at, :datetime, comment: "cache_data を保存した日時"
  end
end
