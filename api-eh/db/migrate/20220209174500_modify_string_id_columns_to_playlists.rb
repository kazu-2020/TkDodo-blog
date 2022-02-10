class ModifyStringIdColumnsToPlaylists < ActiveRecord::Migration[6.1]
  def up
    rename_column :playlists, :string_id, :string_uid
    change_column_comment :playlists, :string_uid, 'プレイリスト文字列ID（ハッシュ値）'
    add_column :playlists, :string_id, :string, after: :link_dark_color, comment: 'プレイリスト文字列ID（eh始まり)'
  end

  def down
    remove_column :playlists, :string_id
    rename_column :playlists, :string_uid, :string_id
    change_column_comment :playlists, :string_uid, 'プレイリスト文字列ID'
  end
end
