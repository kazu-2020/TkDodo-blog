# frozen_string_literal: true

class AddColumnToDeck < ActiveRecord::Migration[6.0]
  def change
    add_column :decks, :description, :text, after: :name, comment: 'デッキの説明'
    add_column :decks, :item_type, :string, default: 'recommend', after: :area, comment: 'デッキを構成するプレイリストのタイプ'
    add_column :decks, :is_r5, :boolean, default: false, null: false, after: :item_type, comment: 'r5 相当のデッキか'
  end
end
