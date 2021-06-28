# frozen_string_literal: true

FactoryBot.define do
  factory :citation do
    association :playlist
    name { 'Awesome Name' }
    url { 'https://example.com' }
  end
end
