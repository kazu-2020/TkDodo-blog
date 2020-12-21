# frozen_string_literal: true

FactoryBot.define do
  factory :playlist_hashtag do
    association :playlist
    sequence(:name) { |n| "Awesome Hashtag#{n}" }
  end
end
