# frozen_string_literal: true

class Deck < ApplicationRecord
  has_many :deck_playlists, -> { order(position: :asc) }
  has_many :playlists, through: :deck_playlists
  accepts_nested_attributes_for :playlists
  has_many :deck_same_as, dependent: :destroy
  accepts_nested_attributes_for :deck_same_as, allow_destroy: true
  belongs_to :deck_label, optional: true

  validates :name, presence: true
  validates :deck_uid, presence: true

  before_validation :set_uids

  def deck_id(type)
    "#{type_of_deck}-#{is_r5? ? 'r5' : 'r6'}-#{type}-#{area}"
  end

  def total_time
    playlists.sum(&:total_time)
  end

  def rebuild_playlists_to(new_playlists)
    current_playlists = playlists.pluck(:id)

    ActiveRecord::Base.transaction do
      new_playlist_ids = (current_playlists | new_playlists) - current_playlists
      add_playlists!(new_playlist_ids)

      remove_playlist_ids = (current_playlists | new_playlists) - new_playlists
      remove_playlists!(remove_playlist_ids)

      reorder_playlists(new_playlists)
    end

    touch
  end

  private

  def set_uids
    self.deck_uid = SecureRandom.uuid if deck_uid.blank?
  end

  def add_playlists!(playlist_ids)
    playlist_ids.each do |playlist_id|
      deck_playlists.create!(deck_id: id, playlist_id: playlist_id)
    end
  end

  def remove_playlists!(playlist_ids)
    playlist_ids.each do |playlist_id|
      deck_playlists.find_by(deck_id: id, playlist_id: playlist_id).destroy!
    end
  end

  def reorder_playlists(new_playlist_order)
    new_playlist_order.each_with_index do |playlist_id, i|
      next if playlist_id == reload.playlists[i].id

      sort_target_deck_playlist = deck_playlists.find_by(deck_id: id, playlist_id: playlist_id)
      sort_target_deck_playlist.set_list_position(i + 1)
    end
  end
end
