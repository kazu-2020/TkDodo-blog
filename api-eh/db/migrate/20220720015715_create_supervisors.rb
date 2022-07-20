class CreateSupervisors < ActiveRecord::Migration[7.0]
  def change
    create_table :supervisors do |t|
      t.references :person_organization_locals, foreign_key: true, null: false
      t.references :playlist, foreign_key: true, null: false
      t.json :image_data
      t.string :type
      t.bigint :type_id
      t.timestamps
    end
  end
end
