# frozen_string_literal: true

class AddHasFaqPageColumnToPlaylistItems < ActiveRecord::Migration[6.0]
  def change
    add_column :playlist_items, :has_faq_page,
               :boolean, default: false, null: false, after: :has_event, comment: 'FAQ 保持フラグ'
  end
end
