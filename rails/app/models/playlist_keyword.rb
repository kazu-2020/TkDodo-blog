# frozen_string_literal: true

class PlaylistKeyword < ApplicationRecord
  belongs_to :playlist

  validates :name, presence: true, uniqueness: { scope: :playlist, case_sensitive: true }
end
