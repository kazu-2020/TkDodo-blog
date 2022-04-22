# frozen_string_literal: true

FactoryBot.define do
  factory :deck do
    sequence(:name) { |n| "deck #{n}" }
    description { 'description for the sample ' }
    interfix { 'sample' }
    area { 130 }
    admin_memo { 'test memo' }
    deck_uid { SecureRandom.uuid }
  end

  trait :with_playlists do
    after(:build) do |deck, _|
      2.times { deck.playlists << build(:playlist) }
    end
  end
end
