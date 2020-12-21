# frozen_string_literal: true

class Deck < ApplicationRecord
  has_many :playlists, dependent: :destroy

  validates :name, presence: true
  validates :area, presence: true
  validates :visible_uid, presence: true
  validates :editorial_uid, presence: true

  before_create :set_uids

  private

  def set_uids
    self.visible_uid = SecureRandom.uuid
    self.editorial_uid = SecureRandom.uuid
  end
end
