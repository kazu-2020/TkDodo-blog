# frozen_string_literal: true

class DecksJob < ApplicationJob
  class_timeout 300 # seconds

  def initialize_deck
    deck = Deck.first
    deck.is_r5 = true

    deck.save

    Deck.create(
      name: 'おすすめプレイリスト',
      description: '説明が入ります。',
      area: '130'
    )
  end
end
