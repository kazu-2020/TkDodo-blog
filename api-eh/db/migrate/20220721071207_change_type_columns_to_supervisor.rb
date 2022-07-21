class ChangeTypeColumnsToSupervisor < ActiveRecord::Migration[7.0]
  def change
    rename_column :supervisors, :type, :contents_type
    rename_column :supervisors, :type_id, :contents_type_id
  end
end
