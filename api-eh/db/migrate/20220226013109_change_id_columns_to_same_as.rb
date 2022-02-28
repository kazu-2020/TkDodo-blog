class ChangeIdColumnsToSameAs < ActiveRecord::Migration[6.1]
  def up
    change_column :same_as, :playlist_id, :bigint

    add_foreign_key :same_as, :playlists
  end

  def down
    change_column :same_as, :playlist_id, :integer

    remove_foreign_key :same_as, :playlists
  end
end
