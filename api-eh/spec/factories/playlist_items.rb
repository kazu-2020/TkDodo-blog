# frozen_string_literal: true

FactoryBot.define do
  factory :playlist_item do
    association :playlist
    sequence(:episode_id) { |n| "EPISODE#{n}" }
    context { 'TVEpisode' }
    item_id { episode_id }
    sequence(:position)
  end
end
