class CreateWikidataSameAs < ActiveRecord::Migration[7.0]
  def change
    create_table :wikidata_same_as do |t|
      t.string :wikidata_id, null: false
      t.string :same_as_wikidata_id, null: false
      t.timestamps
    end
    add_index :wikidata_same_as, :wikidata_id, unique: true
  end
end
