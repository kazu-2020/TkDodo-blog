# frozen_string_literal: true

class Deck < ApplicationRecord
  has_many :deck_playlists, -> { order(position: :asc) }
  has_many :playlists, through: :deck_playlists

  validates :name, presence: true
  validates :area, presence: true
  validates :visible_uid, presence: true
  validates :editorial_uid, presence: true

  before_validation :set_uids

  def deck_id(type)
    "#{item_type}-#{is_r5? ? 'r5' : 'r6'}-#{type}-#{area}"
  end

  def total_time
    playlists.pluck(:total_time).sum
  end

  private

  def set_uids
    self.visible_uid = SecureRandom.uuid if visible_uid.blank?
    self.editorial_uid = SecureRandom.uuid if editorial_uid.blank?
  end
end
