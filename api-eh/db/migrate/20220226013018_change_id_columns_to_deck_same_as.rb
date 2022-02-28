class ChangeIdColumnsToDeckSameAs < ActiveRecord::Migration[6.1]
  def up
    change_column :deck_same_as, :deck_id, :bigint

    add_foreign_key :deck_same_as, :decks
  end

  def down
    change_column :deck_same_as, :deck_id, :integer

    remove_foreign_key :deck_same_as, :decks
  end
end
