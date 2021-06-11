# frozen_string_literal: true

class AddTypeColoumnToPlaylistItem < ActiveRecord::Migration[6.0]
  def change
    add_column :playlist_items, :context, :string, after: :episode_id, comment: 'アイテムの種別(Type)'
    add_column :playlist_items, :item_id, :string, after: :context, comment: 'コンテキストに紐づくアイテムのID'
  end
end
