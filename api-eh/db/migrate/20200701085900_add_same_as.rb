# frozen_string_literal: true

class AddSameAs < ActiveRecord::Migration[6.0]
  def change
    create_table :same_as do |t|
      t.integer :playlist_id, null: false
      t.string  :name, null: false
      t.string  :url, null: false

      t.timestamps
    end

    add_index :same_as, :playlist_id, name: 'idx_playlist_id', unique: true
  end
end
