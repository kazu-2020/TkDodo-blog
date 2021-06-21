# frozen_string_literal: true

class Deck < ApplicationRecord
  has_many :playlists, dependent: :destroy

  validates :name, presence: true
  validates :area, presence: true
  validates :visible_uid, presence: true
  validates :editorial_uid, presence: true

  before_validation :set_uids

  def deck_uid(deck_id)
    case deck_id
    when /visible/
      visible_uid
    when /editorial/
      editorial_uid
    else
      ''
    end
  end

  def deck_id(type)
    "#{item_type}-#{type}-#{is_r5? ? 'r5-' : ''}#{area}"
  end

  private

  def set_uids
    self.visible_uid = SecureRandom.uuid if visible_uid.blank?
    self.editorial_uid = SecureRandom.uuid if editorial_uid.blank?
  end
end
