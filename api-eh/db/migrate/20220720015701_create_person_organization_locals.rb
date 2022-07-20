class CreatePersonOrganizationLocals < ActiveRecord::Migration[7.0]
  def change
    create_table :person_organization_locals do |t|
      t.string :uuid
      t.string :role, null: false, comment:'Person: 個人 Organization: 組織'
      t.string :name, null: false
      t.text :occupation
      t.text :description
      t.integer :name_format, null: false
      t.string :family_name
      t.string :given_name
      t.string :additional_name
      t.string :name_ruby
      t.string :family_name_ruby
      t.string :given_name_ruby
      t.json :image_data, comment:'表示用。外部公開はしない。Shrineのフォーマット'
      t.timestamps
    end
    add_index :person_organization_locals, :uuid, unique: true
  end
end
