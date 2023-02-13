# frozen_string_literal: true
Ability::SYSTEM_ROLES.keys.map do |role_name|
  Role.create!(name: role_name)
end
