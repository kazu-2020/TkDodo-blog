# frozen_string_literal: true
Ability::SYSTEM_ROLES.keys.map do |role_name|
  Role.create_or_find_by(name: role_name)
end
