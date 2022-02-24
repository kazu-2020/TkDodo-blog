# frozen_string_literal: true

class SeriesPlaylist < ApplicationRecord
  has_many :series_deck_playlists, -> { order(position: :asc) }
  has_many :series_decks, through: :series_deck_playlists

  validates :series_id, uniqueness: { case_sensitive: true }, if: :series_id?
end
