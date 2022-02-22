# frozen_string_literal: true

FactoryBot.define do
  factory :article_image do
    association :playlist
    sequence(:image_id) { |n| "image_#{n}" }

    trait :with_image do
      after(:build) do |article_image|
        article_image.image = File.open(Rails.root.join('spec', 'fixtures', 'images', 'test.jpg'))
      end
    end
  end
end
