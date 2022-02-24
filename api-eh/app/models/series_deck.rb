# frozen_string_literal: true

class SeriesDeck < ApplicationRecord
  has_many :series_deck_playlists, -> { order(position: :asc) }
  has_many :series_playlists, through: :series_deck_playlists
  accepts_nested_attributes_for :series_playlists
  # has_many :series_deck_same_as, dependent: :destroy
  # accepts_nested_attributes_for :series_deck_same_as, allow_destroy: true
  # belongs_to :series_deck_label, optional: true
end
