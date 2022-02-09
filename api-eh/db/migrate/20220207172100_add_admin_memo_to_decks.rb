class AddAdminMemoToDecks < ActiveRecord::Migration[6.1]
  def change
    add_column :decks, :admin_memo, :string, after: :editorial_uid, comment: '管理メモ'
    add_column :decks, :deck_label_id, :integer, after: :description, comment: 'デッキラベル ID'

    create_table :deck_labels do |t|
      t.string  :display_name, null: false, comment: '表示名'
      t.string  :name, null: false, comment: 'ラベル（英数）'

      t.timestamps
    end
  end
end
