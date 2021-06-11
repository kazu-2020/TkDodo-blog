# frozen_string_literal: true

class AddPublisherTypeToPlaylist < ActiveRecord::Migration[6.0]
  def change
    add_column :playlists, :publisher_type, :string, after: :author_name, comment: 'Person or Organization'
    rename_column :playlists, :publisher, :publisher_name
    change_column :playlists, :publisher_name, :string, comment: '発行者名'
  end
end
