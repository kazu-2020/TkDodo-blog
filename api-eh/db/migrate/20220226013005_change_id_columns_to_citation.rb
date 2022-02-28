class ChangeIdColumnsToCitation < ActiveRecord::Migration[6.1]
  def up
    change_column :citations, :playlist_id, :bigint

    add_foreign_key :citations, :playlists
  end

  def down
    change_column :citations, :playlist_id, :integer

    remove_foreign_key :citations, :playlists
  end
end
