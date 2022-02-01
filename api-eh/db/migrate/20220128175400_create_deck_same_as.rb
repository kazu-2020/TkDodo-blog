class CreateDeckSameAs < ActiveRecord::Migration[6.1]
  def change
    create_table :deck_same_as do |t|
      t.integer :deck_id, null: false
      t.string  :name, null: false
      t.string  :url, null: false

      t.timestamps
    end
    add_index :deck_same_as, :deck_id
  end
end
