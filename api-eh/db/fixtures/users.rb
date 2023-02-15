# frozen_string_literal: true
# NOTE: E2Eテスト用にユーザーを作成しています

# Admin
User.create_or_find_by(
  id: 1,
  man_number: "#{Faker::Alphanumeric.alpha(number: 10)}@example.com",
  email: 'tanaka@example.com',
  first_name: '田中',
  last_name: '太郎',
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
  email: 'sato@example.com',
  first_name: '佐藤',
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
  email: 'ichiro@example.com',
  last_name: '一郎',
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
  email: 'nanashi@example.com',
  job_class: 1, # 0: Admin, 1: User
  logged_in_at: nil,
  invited_at: Faker::Time.between(from: 1.year.ago, to: Time.now),
  created_at: Faker::Time.between(from: 1.year.ago, to: Time.now),
  updated_at: Faker::Time.between(from: 1.year.ago, to: Time.now)
)
