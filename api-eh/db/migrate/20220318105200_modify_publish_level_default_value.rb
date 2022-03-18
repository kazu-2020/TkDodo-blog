class ModifyPublishLevelDefaultValue < ActiveRecord::Migration[6.1]
  def up
    change_column_default :playlists, :publish_level, 'full'
  end

  def down
    change_column_default :playlists, :publish_level, 'notyet'
  end
end
