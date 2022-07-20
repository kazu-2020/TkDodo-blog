class CreateWikidataJsons < ActiveRecord::Migration[7.0]
  def change
    create_table :wikidata_jsons do |t|
      t.string :wikidata_id, null: false
      t.json :basic_json, null: false
      t.json :property_json, null: false
      t.timestamps
    end
    add_index :wikidata_jsons, :wikidata_id, unique: true
  end
end
