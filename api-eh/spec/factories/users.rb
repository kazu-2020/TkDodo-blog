# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "editorialhands#{n}@exmaple.com" }
    okta_uid { SecureRandom.uuid }
    first_name { '太郎' }
    last_name { '山田' }
  end
end
