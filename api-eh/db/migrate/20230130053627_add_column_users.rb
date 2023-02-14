class AddColumnUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :man_number, :string, after: :okta_uid, comment: 'マンナンバー'
    add_index :users, :man_number, unique: true
  end
end
