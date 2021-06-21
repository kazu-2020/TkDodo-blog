# frozen_string_literal: true

FactoryBot.define do
  factory :deck do
    sequence(:name) { |n| "deck #{n}" }
    area { 130 }
    visible_uid { SecureRandom.uuid }
    editorial_uid { SecureRandom.uuid }
  end
end
