class AddNotNullConstraintToPlaylist < ActiveRecord::Migration[6.1]
  def change
    change_column_null :playlists, :logo_image_data, false
    change_column_null :playlists, :eyecatch_image_data, false
    change_column_null :playlists, :hero_image_data, false
  end
end
