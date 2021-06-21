# frozen_string_literal: true

class RenamePlaylistKeywords < ActiveRecord::Migration[6.0]
  def change
    rename_column :playlists, :keyword, :keywords
    rename_column :playlists, :name_ruby, :detailed_name_ruby
  end
end
