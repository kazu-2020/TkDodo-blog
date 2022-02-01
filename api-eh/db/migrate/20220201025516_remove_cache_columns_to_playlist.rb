class RemoveCacheColumnsToPlaylist < ActiveRecord::Migration[6.1]
  def change
    remove_column :playlists, :playlist_items_count, :integer, comment: "エピソード数"
    remove_column :playlists, :playable_playlist_items_count, :integer, comment: "再生可能なエピソード数"
    remove_column :playlists, :faq_page_count, :integer, comment: "FAQページ数"
    remove_column :playlists, :how_to_count, :integer, comment: "ハウツー数"
    remove_column :playlists, :event_count, :integer, comment: "イベント数"
    remove_column :playlists, :total_time, :integer, comment: "プレイリストの総時間"
    remove_column :playlists, :playable_total_time, :integer, comment: "プレイリスト再生可能時間"
  end
end
