# frozen_string_literal: true

class AddSubtypeColumnsToPlaylists < ActiveRecord::Migration[6.0]
  def change
    add_column :playlists, :faq_page_count,
               :integer, default: 0, null: false, after: :playable_playlist_items_count, comment: 'FAQページ数'
    add_column :playlists, :how_to_count,
               :integer, default: 0, null: false, after: :faq_page_count, comment: 'ハウツー数'
    add_column :playlists, :event_count,
               :integer, default: 0, null: false, after: :how_to_count, comment: 'イベント数'
  end
end
