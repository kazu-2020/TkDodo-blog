class AddInterfixToDecks < ActiveRecord::Migration[6.1]
  def up
    add_column :decks, :interfix, :string, after: :is_r5, comment: 'deckId の中間接辞'
    remove_column :decks, :deck_label_id, :integer, after: :description, comment: 'デッキラベル ID'
    rename_column :decks, :item_type, :type_of_deck
    change_column_comment :decks, :type_of_deck, 'デッキを構成するプレイリストのタイプ'
    add_column :decks, :mode_of_item, :string, after: :type_of_deck, comment: 'デッキを構成するプレイリストのアイテムモード'
    add_column :decks, :type_of_item, :string, after: :mode_of_item, comment: 'デッキを構成するプレイリストのアイテムタイプ'
    add_column :decks, :deck_id, :string, after: :description, comment: '計測用の deckId'
    remove_column :decks, :editorial_uid
    rename_column :decks, :visible_uid, :deck_uid
    change_column_comment :decks, :deck_uid, 'デッキ uid'

    drop_table :deck_labels
  end

  def down
    remove_column :decks, :interfix
    add_column :decks, :deck_label_id, :integer, after: :description, comment: 'デッキラベル ID'
    rename_column :decks, :type_of_deck, :item_type
    change_column_comment :decks, :item_type, 'デッキを構成するプレイリストのタイプ'
    remove_column :decks, :mode_of_item
    remove_column :decks, :type_of_item
    remove_column :decks, :deck_id
    add_column :decks, :editorial_uid, :string, after: :is_r5, comment: 'Editorial APIレスポンス時のUID'
    rename_column :decks, :deck_uid, :visible_uid
    change_column_comment :decks, :visible_uid, 'Visible APIレスポンス時のUID'

    create_table :deck_labels do |t|
      t.string  :display_name, null: false, comment: '表示名'
      t.string  :name, null: false, comment: 'ラベル（英数）'

      t.timestamps
    end
  end
end
