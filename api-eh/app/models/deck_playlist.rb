class DeckPlaylist < ApplicationRecord
  belongs_to :deck, optional: true
  belongs_to :playlist, optional: true

  acts_as_list scope: :deck, sequential_updates: true
end
