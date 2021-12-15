class ModifySameAsIndex < ActiveRecord::Migration[6.1]
  def up
    remove_index :same_as, :playlist_id
    add_index :same_as, :playlist_id
  end

  def down
    remove_index :same_as, :playlist_id
    add_index :same_as, :playlist_id, unique: true
  end
end
