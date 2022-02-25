class SeriesDeckPlaylist < ApplicationRecord
  belongs_to :series_deck, optional: true
  belongs_to :series_playlist, optional: true

  acts_as_list scope: :series_deck, sequential_updates: true
end
