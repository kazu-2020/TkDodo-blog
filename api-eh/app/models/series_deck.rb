# frozen_string_literal: true

class SeriesDeck < ApplicationRecord
  has_many :series_deck_playlists, -> { order(position: :asc) }, dependent: :destroy
  has_many :series_playlists, through: :series_deck_playlists
  accepts_nested_attributes_for :series_playlists
  # has_many :series_deck_same_as, dependent: :destroy
  # accepts_nested_attributes_for :series_deck_same_as, allow_destroy: true
  # belongs_to :series_deck_label, optional: true

  def rebuild_playlists_to(new_playlist_series_ids)
    current_playlists = series_playlists.pluck(:series_id)

    ActiveRecord::Base.transaction do
      new_series_ids = (current_playlists | new_playlist_series_ids) - current_playlists
      add_playlists!(new_series_ids)

      remove_series_ids = (current_playlists | new_playlist_series_ids) - new_playlist_series_ids
      remove_playlists!(remove_series_ids)

      reorder_playlists(new_playlist_series_ids)
    end

    touch
  end

  private

  def add_playlists!(series_ids)
    series_ids.each do |series_id|
      series_playlist =
        if SeriesPlaylist.find_by(series_id: series_id).nil?
          SeriesPlaylist.create!(string_id: "ts-#{series_id}", series_id: series_id)
        else
          SeriesPlaylist.find_by(series_id: series_id)
        end
      series_deck_playlists.create!(series_deck_id: id, series_playlist_id: series_playlist.id)
    end
  end

  def remove_playlists!(series_ids)
    series_ids.each do |series_id|
      series_playlist = SeriesPlaylist.find_by(series_id: series_id)
      series_deck_playlists.find_by(series_deck_id: id, series_playlist_id: series_playlist.id).destroy!
    end
  end

  def reorder_playlists(new_series_id_order)
    playlists = SeriesPlaylist.where(series_id: new_series_id_order)

    new_series_id_order.each_with_index do |series_id, i|
      series_playlist = playlists.find_by(series_id: series_id)
      next if series_playlist.id == reload.series_playlists[i].id

      sort_target_deck_playlist = series_deck_playlists.find_by(series_deck_id: id,
                                                                series_playlist_id: series_playlist.id)
      sort_target_deck_playlist.set_list_position(i + 1)
    end
  end
end
