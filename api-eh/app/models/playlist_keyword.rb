# frozen_string_literal: true

class PlaylistKeyword < ApplicationRecord
  belongs_to :playlist, optional: true

  validates :name, presence: true, uniqueness: { scope: :playlist, case_sensitive: true }
end
