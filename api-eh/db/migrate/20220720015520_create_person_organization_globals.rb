class CreatePersonOrganizationGlobals < ActiveRecord::Migration[7.0]
  def change
    create_table :person_organization_globals do |t|
      t.string :uuid, null: false
      t.string :viaf_id
      t.string :viaf_name
      t.string :wikidata_id
      t.string :wikidata_name
      t.string :wikidata_occupation, comment: 'wikidataのoccupation(P106)をもとに生成する'
      t.string :wikidata_image_url
      t.text :wikidata_description,comment:'wikidataのdescriptionsをもとに生成する'
      t.boolean :wikidata_alias
      t.timestamps
    end
    add_index :person_organization_globals, :uuid, unique: true
    add_index :person_organization_globals, :viaf_id, unique: true
    add_index :person_organization_globals, :wikidata_id, unique: true
  end
end
