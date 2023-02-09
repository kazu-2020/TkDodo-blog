# frozen_string_literal: true
require 'faker'

FactoryBot.define do
  factory :user do
    sequence(:email) { Faker::Internet.unique.email }
    man_number { "#{Faker::Alphanumeric.alpha(number: 10)}@example.com" }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
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
