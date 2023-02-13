# frozen_string_literal: true
User.ids.each do |user_id|
  Role.ids.each do |role_id|
    UsersRole.create(user_id: user_id, role_id: role_id)
  end
end
