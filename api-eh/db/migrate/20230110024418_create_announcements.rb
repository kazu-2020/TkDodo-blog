class CreateAnnouncements < ActiveRecord::Migration[7.0]
  def change
    create_table :announcements do |t|
      t.integer :status, null: false, default: 0
      t.string :description, null: false

      t.timestamps
    end
  end
end
