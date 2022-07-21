class CreateWikidataProperties < ActiveRecord::Migration[7.0]
  def change
    create_table :wikidata_properties do |t|
      t.string :wikidata_id, null: false
      t.string :name, null: false
      t.timestamps
    end
    add_index :wikidata_properties, :wikidata_id, unique: true
  end
end
