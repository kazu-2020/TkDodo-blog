# frozen_string_literal: true

class Deck < ApplicationRecord
  extend FriendlyId
  include ApiStatable

  friendly_id :deck_uid

  has_many :deck_playlists, -> { order(position: :asc) }, dependent: :destroy
  has_many :playlists, through: :deck_playlists
  accepts_nested_attributes_for :playlists
  has_many :deck_same_as, dependent: :destroy
  accepts_nested_attributes_for :deck_same_as, allow_destroy: true
  belongs_to :deck_label, optional: true

  validates :name, presence: true
  validates :deck_uid, presence: true
  validates :interfix, presence: true

  before_validation :set_default_values

  before_save :set_deck_id

  after_create :set_initial_deck_id

  scope :name_or_admin_memo_like, lambda { |query|
    where('name LIKE ?', "%#{query}%").or(where('admin_memo LIKE ?', "%#{query}%"))
  }

  def total_time
    playlists.sum(&:total_time)
  end

  def rebuild_playlists_to(new_playlist_ids)
    safe_new_playlist_ids = new_playlist_ids.map(&:to_i).uniq # 文字列のIDが混ざって不具合を起こす場合があったのでその対応

    deck_playlists.clear

    self.playlists = safe_new_playlist_ids.map do |playlist_id|
      Playlist.find_by(id: playlist_id)
    end.compact

    touch
  end

  private

  def set_default_values
    self.deck_uid = SecureRandom.uuid if deck_uid.blank?
    self.mode_of_item ||= 'tv'
    self.type_of_item ||= 'TVEpisode'
  end

  def set_initial_deck_id(with_save: true)
    return if id.nil?

    self.deck_id = "#{type_of_deck}-#{mode_of_item}-for-#{interfix}-#{format('%010d', id)}"
    save if with_save
  end

  def set_deck_id
    if will_save_change_to_attribute?('type_of_deck') ||
       will_save_change_to_attribute?('mode_of_item') ||
       will_save_change_to_attribute?('interfix')
      set_initial_deck_id(with_save: false)
    end
  end
end
