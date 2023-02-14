# frozen_string_literal: true

json.id user.id
json.firstName user.first_name
json.lastName user.last_name
json.email user.email
json.jobClass user.job_class
json.systemRoles user.roles.map { |role| role.name.camelize(:lower) } # rubocop:disable Lint/AmbiguousBlockAssociation
json.loggedInAt user.logged_in_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
json.invitedAt user.invited_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
json.createdAt user.created_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
json.updatedAt user.updated_at&.in_time_zone('Asia/Tokyo')&.strftime('%Y-%m-%dT%H:%M:%S+09:00')
