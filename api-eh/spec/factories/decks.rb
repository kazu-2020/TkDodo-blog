# frozen_string_literal: true

FactoryBot.define do
  factory :deck do
    sequence(:name) { |n| "deck #{n}" }
    area { 130 }
    interfix { 'sample' }
    deck_uid { SecureRandom.uuid }
  end
end
