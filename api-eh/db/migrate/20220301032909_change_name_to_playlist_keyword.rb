class ChangeNameToPlaylistKeyword < ActiveRecord::Migration[6.1]
  def change
    change_column_null :playlist_keywords, :name, false
  end
end
