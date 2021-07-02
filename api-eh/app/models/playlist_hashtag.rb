# frozen_string_literal: true

class PlaylistHashtag < ApplicationRecord
  belongs_to :playlist, optional: true

  validates :name, presence: true, uniqueness: { scope: :playlist, case_sensitive: true }
end
