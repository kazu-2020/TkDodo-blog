# frozen_string_literal: true

class AddAuthorAndPublisher < ActiveRecord::Migration[6.0]
  def change
    add_column :playlists, :author_type, :string, after: :editor_data, comment: 'Person or Organization'
    add_column :playlists, :author_name, :string, after: :author_type, comment: '著者名'
    add_column :playlists, :publisher, :string, after: :author_name, comment: '発行者'
  end
end
