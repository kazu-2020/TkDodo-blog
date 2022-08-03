class AddColumnToPlaylists < ActiveRecord::Migration[7.0]
  def change
    add_column :playlists, :active_recipe, :boolean, default: false, null: true, after: :active_event, comment: 'recipe の入力がアクティブかどうか'
  end
end
