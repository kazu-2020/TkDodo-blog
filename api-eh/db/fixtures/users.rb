# frozen_string_literal: true
# NOTE: E2Eテスト用にユーザーを作成しています

# Admin
User.create_or_find_by(
  id: 1,
  man_number: "#{Faker::Alphanumeric.alpha(number: 10)}@example.com",
  email: Faker::Internet.unique.email,
  first_name: Faker::Name.first_name,
  last_name: Faker::Name.last_name,
  job_class: 0, # 0: Admin, 1: User
  logged_in_at: Faker::Time.between(from: 1.year.ago, to: Time.now),
  invited_at: Faker::Time.between(from: 1.year.ago, to: Time.now),
  created_at: Faker::Time.between(from: 1.year.ago, to: Time.now),
  updated_at: Faker::Time.between(from: 1.year.ago, to: Time.now)
)

# User
User.create_or_find_by(
  id: 2,
  man_number: "#{Faker::Alphanumeric.alpha(number: 10)}@example.com",
  email: Faker::Internet.unique.email,
  first_name: Faker::Name.first_name,
  last_name: Faker::Name.last_name,
  job_class: 1, # 0: Admin, 1: User
  logged_in_at: Faker::Time.between(from: 1.year.ago, to: Time.now),
  invited_at: Faker::Time.between(from: 1.year.ago, to: Time.now),
  created_at: Faker::Time.between(from: 1.year.ago, to: Time.now),
  updated_at: Faker::Time.between(from: 1.year.ago, to: Time.now)
)

# 職位なし
User.create_or_find_by(
  id: 3,
  man_number: "#{Faker::Alphanumeric.alpha(number: 10)}@example.com",
  email: Faker::Internet.unique.email,
  first_name: Faker::Name.first_name,
  last_name: Faker::Name.last_name,
  job_class: nil,
  logged_in_at: Faker::Time.between(from: 1.year.ago, to: Time.now),
  invited_at: Faker::Time.between(from: 1.year.ago, to: Time.now),
  created_at: Faker::Time.between(from: 1.year.ago, to: Time.now),
  updated_at: Faker::Time.between(from: 1.year.ago, to: Time.now)
)

# User: 未ログイン
User.create_or_find_by(
  id: 4,
  man_number: "#{Faker::Alphanumeric.alpha(number: 10)}@example.com",
  email: Faker::Internet.unique.email,
  first_name: Faker::Name.first_name,
  last_name: Faker::Name.last_name,
  job_class: 1, # 0: Admin, 1: User
  logged_in_at: nil,
  invited_at: Faker::Time.between(from: 1.year.ago, to: Time.now),
  created_at: Faker::Time.between(from: 1.year.ago, to: Time.now),
  updated_at: Faker::Time.between(from: 1.year.ago, to: Time.now)
)
