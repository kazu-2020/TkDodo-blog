# frozen_string_literal: true

FactoryBot.define do
  factory :series_playlist do
    author_name { 'オウサム　ネーム' }
    headline { 'ヘッドラインのテキストが入ります' }
    active_article { [true, false].sample }
  end
end
