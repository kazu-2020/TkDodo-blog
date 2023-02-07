class RemoveColumnToUsers < ActiveRecord::Migration[7.0]
  def change
    remove_column :users, :okta_uid, :string
  end
end
