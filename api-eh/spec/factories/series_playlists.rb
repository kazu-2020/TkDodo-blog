# frozen_string_literal: true

FactoryBot.define do
  factory :series_playlist do
    author_name { 'オウサム　ネーム' }
    headline { 'ヘッドラインのテキストが入ります' }
    active_article { [true, false].sample }
    series_id { SecureRandom.alphanumeric(10) }
    string_id { "ts-#{series_id}"}
    type_of_list { 'series' }
    mode_of_item { 'tv' }
  end
end
