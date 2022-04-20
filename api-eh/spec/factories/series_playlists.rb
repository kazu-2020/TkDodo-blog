# frozen_string_literal: true

FactoryBot.define do
  factory :series_playlist do
    author_name { 'オウサム　ネーム' }
    headline { 'ヘッドラインのテキストが入ります' }
    marked_header { 'ヘッダのテキストが入ります' }
    article_body { 'ボディのテキストが入ります' }
    marked_footer { 'フッタのテキストが入ります' }
    available_article { [true, false].sample }
    active_article { [true, false].sample }
  end
end
