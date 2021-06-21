# frozen_string_literal: true

class AddDiscardedAtToPlaylistItems < ActiveRecord::Migration[6.0]
  def change
    add_column :playlist_items, :discarded_at, :datetime, after: :cached_data, comment: '削除日時'
    add_index :playlist_items, :discarded_at
  end
end
