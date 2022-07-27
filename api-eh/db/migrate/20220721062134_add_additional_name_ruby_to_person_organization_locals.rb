class AddAdditionalNameRubyToPersonOrganizationLocals < ActiveRecord::Migration[7.0]
  def change
    add_column  :person_organization_locals, :additional_name_ruby, :string
  end
end
