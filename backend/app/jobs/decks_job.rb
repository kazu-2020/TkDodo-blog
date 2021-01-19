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

  def assign_all_playlist_to_deck
    deck = Deck.find_by(is_r5: false)
    playlists = Playlist.where('deck_id IS NULL')

    playlists.each do |playlist|
      playlist.deck = deck
      playlist.save
    end
  end
end
