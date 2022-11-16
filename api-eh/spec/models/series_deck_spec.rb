# frozen_string_literal: true

require 'rails_helper'

describe 'SeriesDeck' do
  describe '#rebuild_playlists_to' do
    let!(:series_deck) { create(:series_deck, :with_series_playlists) }

    it 'playlistの紐付けが正しく行われること' do
      new_playlist_ids = series_deck.series_playlists.map(&:series_id)
      series_deck.rebuild_playlists_to(new_playlist_ids)

      expect(series_deck.reload.series_playlists.map(&:series_id)).to eq new_playlist_ids
    end

    it 'playlistが並び替えられていること' do
      current_playlist_ids = series_deck.series_playlists.map(&:series_id)
      new_playlist_ids = series_deck.series_playlists.map(&:series_id).reverse
      series_deck.rebuild_playlists_to(new_playlist_ids)

      expect(series_deck.reload.series_playlists.map(&:series_id)).to eq current_playlist_ids.reverse
    end
  end
end
