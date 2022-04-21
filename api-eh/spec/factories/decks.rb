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
  end

  trait :with_playlist do
    after(:build) do |deck|
      deck.playlists << build(:playlist)

  trait :with_playlists do
    after(:create) do |deck, _|
      create_list(:playlist, 2, decks: [deck])
    end
  end
end
