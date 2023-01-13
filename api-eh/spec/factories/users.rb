# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "editorialhands#{n}@exmaple.com" }
    okta_uid { SecureRandom.uuid }
    first_name { '太郎' }
    last_name { '山田' }
  end

  trait :super_admin do
    before :create, &:grant_super_admin!
  end

  trait :user_admin do
    before :create, &:grant_user_admin!
  end

  trait :playlist_admin do
    before :create, &:grant_playlist_admin!
  end

  trait :deck_admin do
    before :create, &:grant_deck_admin!
  end

  trait :reader_user do
    before :create, &:grant_reader!
  end
end
