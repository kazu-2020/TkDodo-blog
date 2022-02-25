class AddApiStateToDecks < ActiveRecord::Migration[6.1]
  def change
    add_column :decks, :api_state, :integer, null: false, default: 0, after: :admin_memo, comment: 'APIの公開状態 close: 0, open: 1, waiting: 2'
  end
end

