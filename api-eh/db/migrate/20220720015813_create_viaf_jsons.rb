class CreateViafJsons < ActiveRecord::Migration[7.0]
  def change
    create_table :viaf_jsons do |t|
      t.string :viaf_id, null: false
      t.json :json, null: false
      t.timestamps
    end
    add_index :viaf_jsons, :viaf_id, unique: true
  end
end
