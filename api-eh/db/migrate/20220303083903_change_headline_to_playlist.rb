class ChangeHeadlineToPlaylist < ActiveRecord::Migration[6.1]
  def up
    change_column :playlists, :headline, :string
  end

  def down
    change_column :playlists, :headline, :text
  end
end
