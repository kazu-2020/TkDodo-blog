# frozen_string_literal: true

class SeriesDeck < ApplicationRecord
  extend FriendlyId
  include ApiStatable

  friendly_id :deck_uid

  has_many :series_deck_playlists, -> { order(position: :asc) }, dependent: :destroy
  has_many :series_playlists, through: :series_deck_playlists
  accepts_nested_attributes_for :series_playlists
  # has_many :series_deck_same_as, dependent: :destroy
  # accepts_nested_attributes_for :series_deck_same_as, allow_destroy: true
  # belongs_to :series_deck_label, optional: true
  before_validation :set_default_values

  before_save :set_string_id
  after_create :set_initial_string_id

  validates :name, :interfix, presence: true

  scope :name_or_admin_memo_like, lambda { |query|
    where('name LIKE ?', "%#{query}%").or(where('admin_memo LIKE ?', "%#{query}%"))
  }

  def rebuild_playlists_to(new_playlist_series_ids)
    self.series_playlists = new_playlist_series_ids.map do |series_id|
      SeriesPlaylist.find_by(series_id: series_id) ||
        SeriesPlaylist.create!(string_id: "ts-#{series_id}", series_id: series_id)
    end

    reorder_playlists_by(new_playlist_series_ids)

    touch
  end

  private

  def set_default_values
    self.deck_uid ||= SecureRandom.uuid
    self.string_id ||= SecureRandom.uuid
    self.api_state ||= self.class.api_states[:close]
    self.mode_of_item ||= 'tv'
    self.type_of_item ||= 'TVEpisode'
  end

  def set_initial_string_id(with_save: true)
    return if id.nil?

    self.string_id = "#{type_of_deck}-#{mode_of_item}-for-#{interfix}-#{format('%010d', id)}"
    save if with_save
  end

  def set_string_id
    if will_save_change_to_attribute?('type_of_deck') ||
       will_save_change_to_attribute?('mode_of_item') ||
       will_save_change_to_attribute?('interfix')
      set_initial_string_id(with_save: false)
    end
  end

  def reorder_playlists_by(new_playlists_series_ids)
    playlists = SeriesPlaylist.where(series_id: new_playlists_series_ids)

    new_playlists_series_ids.each_with_index do |series_id, i|
      series_playlist = playlists.find_by(series_id: series_id)
      next if series_playlist.id == reload.series_playlists[i].id

      sort_target_deck_playlist = series_deck_playlists.find_by(series_deck_id: id,
                                                                series_playlist_id: series_playlist.id)
      sort_target_deck_playlist.set_list_position(i + 1)
    end
  end
end
