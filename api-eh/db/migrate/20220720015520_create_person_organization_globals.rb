class CreatePersonOrganizationGlobals < ActiveRecord::Migration[7.0]
  def change
    create_table :person_organization_globals do |t|
      t.string :uuid, null: false
      t.string :viaf_id
      t.string :viaf_name, comment: 'キャッシュ用'
      t.string :wikidata_id
      t.string :wikidata_name, comment: 'キャッシュ用'
      t.string :wikidata_occupation, comment: 'キャッシュ用 wikidata の occupation(P106) をもとに生成する'
      t.string :wikidata_image_url, comment: 'キャッシュ用'
      t.text :wikidata_description,comment:'キャッシュ用 wikidata の descriptions をもとに生成する'
      t.integer :wikidata_alias, limit: 1, default: 0, comment: '0: false 1: true'
      t.timestamps
    end
    add_index :person_organization_globals, :uuid, unique: true
    add_index :person_organization_globals, :viaf_id, unique: true
    add_index :person_organization_globals, :wikidata_id, unique: true
  end
end
