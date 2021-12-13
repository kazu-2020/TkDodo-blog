class AddAdditionalPropertyColumnsToPlaylist < ActiveRecord::Migration[6.1]
  def change
    add_column :playlists, :type_of_list, :string,
               default: 'recommend', null: false, after: :publish_level, comment: 'typeOfList'
    add_column :playlists, :mode_of_item, :string,
               default: 'tv', null: false, after: :type_of_list, comment: 'modeOfItem'
  end
end
