# frozen_string_literal: true

FactoryBot.define do
  factory :series_deck do
    sequence(:name) { |n| "series deck #{n}" }
    description { 'description for the sample ' }
    interfix { 'sample' }
    area { 130 }
    admin_memo { 'test memo' }
    deck_uid { SecureRandom.uuid }
    api_state { %w[open close].sample }
  end

  trait :with_series_playlists do
    after(:create) do |series_deck, _|
      create_list(:series_playlist, 3, series_decks: [series_deck])
    end
  end
end
