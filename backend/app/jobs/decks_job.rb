# frozen_string_literal: true

class DecksJob < ApplicationJob
  class_timeout 300 # seconds

  cron '0 8 20 1 ? 2021' # 2021/01/20 17:00(JST) に実行 FIXME: 一時的なバッチ処理、後で消す
  def rename_deck
    r5_deck = Deck.find_by(is_r5: true)
    r5_deck.name = '番組まとめ (東京/r5)'

    r5_deck.save!

    deck = Deck.find_by(is_r5: false)
    deck.name = '番組まとめ (東京)'

    deck.save!
  end
end
