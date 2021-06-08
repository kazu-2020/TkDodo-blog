# frozen_string_literal: true

FactoryBot.define do
  factory :playlist_keyword do
    association :playlist
    sequence(:name) { |n| "Awesome Keyword#{n}" }
  end
end
