# frozen_string_literal: true

FactoryBot.define do
  factory :deck do
    sequence(:id) { |n| n }
    sequence(:name) { |n| "deck #{n}" }
    description { 'description for the sample ' }
    interfix { 'sample' }
    area { 130 }
    admin_memo { 'test memo' }
    deck_uid { SecureRandom.uuid }
    created_at { '1900-01-01T00:00:00+09:00' }
    updated_at { '1900-01-01T00:00:00+09:00' }
  end
end
