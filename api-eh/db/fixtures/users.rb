# frozen_string_literal: true

70.times do |i|
  User.create(
    id: i,
    man_number: "#{Faker::Alphanumeric.alpha(number: 10)}@example.com",
    email: Faker::Internet.unique.email,
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    job_class: ['Admin', 'User', nil].sample,
    logged_in_at: Faker::Time.between(from: 1.year.ago, to: Time.now),
    invited_at: Faker::Time.between(from: 1.year.ago, to: Time.now),
    created_at: Faker::Time.between(from: 1.year.ago, to: Time.now),
    updated_at: Faker::Time.between(from: 1.year.ago, to: Time.now)
  )
end

# 未ログインユーザー
30.times do |i|
  User.create(
    id: i + 70,
    man_number: "#{Faker::Alphanumeric.alpha(number: 10)}@example.com",
    email: Faker::Internet.unique.email,
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    job_class: ['Admin', 'User', nil].sample,
    logged_in_at: nil,
    invited_at: Faker::Time.between(from: 1.year.ago, to: Time.now),
    created_at: Faker::Time.between(from: 1.year.ago, to: Time.now),
    updated_at: Faker::Time.between(from: 1.year.ago, to: Time.now)
  )
end
