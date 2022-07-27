class ChangeColumnsPersonOrganizationLocalsIdToSupervisor < ActiveRecord::Migration[7.0]
  def change
    rename_column :supervisors, :person_organization_locals_id, :person_organization_local_id
  end
end
