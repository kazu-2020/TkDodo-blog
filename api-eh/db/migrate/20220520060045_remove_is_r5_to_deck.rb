class RemoveIsR5ToDeck < ActiveRecord::Migration[6.1]
  def change
    remove_column :decks, :is_r5, :boolean
  end
end
