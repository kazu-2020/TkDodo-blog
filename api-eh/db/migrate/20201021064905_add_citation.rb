# frozen_string_literal: true

class AddCitation < ActiveRecord::Migration[6.0]
  def change
    create_table :citations do |t|
      t.integer :playlist_id, null: false
      t.string  :name, null: false
      t.string  :url, null: false

      t.timestamps
    end
  end
end
