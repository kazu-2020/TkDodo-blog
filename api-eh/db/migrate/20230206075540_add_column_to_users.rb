class AddColumnToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :job_class, :integer, limit: 1, null: true, after: :last_name
    add_column :users, :job_type, :string, null: true, after: :job_class
    add_column :users, :logged_in_at, :datetime, null: true, after: :job_type
    add_column :users, :invited_at, :datetime, null: true, after: :logged_in_at
  end
end
