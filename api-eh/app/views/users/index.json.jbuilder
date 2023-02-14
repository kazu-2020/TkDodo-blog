# frozen_string_literal: true

json.users do
  json.array! @users, partial: 'users/user', as: :user
end

json.partial! 'shared/pagination', record: @users
