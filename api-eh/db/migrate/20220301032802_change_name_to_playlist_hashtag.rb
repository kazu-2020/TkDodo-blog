class ChangeNameToPlaylistHashtag < ActiveRecord::Migration[6.1]
  def change
    change_column_null :playlist_hashtags, :name, false
  end
end
