# frozen_string_literal: true

FactoryBot.define do
  o = [('A'..'Z'), ('0'..'9')].map(&:to_a).flatten

  factory :series_playlist do
    author_name { 'オウサム　ネーム' }
    headline { 'ヘッドラインのテキストが入ります' }
    active_article { [true, false].sample }
    series_id { (0...10).map { o[rand(o.length)] }.join } # 10桁の大文字半角英数字
    string_id { "ts-#{series_id}" }
    type_of_list { 'series' }
    mode_of_item { 'tv' }
  end
end
