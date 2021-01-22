# frozen_string_literal: true

class DecksJob < ApplicationJob
  class_timeout 300 # seconds

  def rename_deck
    r5_deck = Deck.find_by(is_r5: true)
    r5_deck.name = 'NHKプラス（r5）'

    r5_deck.save!

    deck = Deck.find_by(is_r5: false)
    deck.name = '番組まとめ (東京)'

    deck.save!
  end
end
