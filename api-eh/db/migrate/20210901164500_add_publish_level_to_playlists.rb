# frozen_string_literal: true

class AddPublishLevelToPlaylists < ActiveRecord::Migration[6.0]
  def change
    add_column :playlists, :publish_level, :string, default: 'notyet',
                null: false, after: :layout_pattern, comment: 'publish level'
  end
end
