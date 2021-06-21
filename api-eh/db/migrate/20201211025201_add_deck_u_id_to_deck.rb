# frozen_string_literal: true

class AddDeckUIdToDeck < ActiveRecord::Migration[6.0]
  def change
    add_column :decks, :visible_uid, :string, after: :area, comment: 'Editorial APIレスポンス時のUID'
    add_column :decks, :editorial_uid, :string, after: :visible_uid, comment: 'Visible APIレスポンス時のUID'
  end
end
