# frozen_string_literal: true

FactoryBot.define do
  factory :announcement do
    contents { 'お知らせ内容' }
    status { :general }

    trait :improved do
      status { :improved }
    end

    trait :maintenance do
      status { :maintenance }
    end

    trait :attentive do
      status { :attentive }
    end

    trait :emergency do
      status { :emergency }
    end
  end
end
