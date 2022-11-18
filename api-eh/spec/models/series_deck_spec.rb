# frozen_string_literal: true

require 'rails_helper'

describe 'SeriesDeck' do
  describe '#rebuild_playlists_to' do
    let!(:series_deck) { create(:series_deck, :with_series_playlists) }

    it 'playlistの紐付けが正しく行われること' do
      new_playlist_ids = series_deck.series_playlists.map(&:series_id) + create_list(:series_playlist,
                                                                                     2).pluck(:series_id)
      series_deck.rebuild_playlists_to(new_playlist_ids)

      expect(series_deck.reload.series_playlists.map(&:series_id)).to eq new_playlist_ids
    end

    it 'playlistが並び替えられていること' do
      current_playlist_ids = series_deck.series_playlists.map(&:series_id)
      new_playlist_ids = series_deck.series_playlists.map(&:series_id).reverse
      series_deck.rebuild_playlists_to(new_playlist_ids)

      expect(series_deck.reload.series_playlists.map(&:series_id)).to eq current_playlist_ids.reverse
    end

    describe 'validation' do
      it '10桁のseries_playlist_idのみ許可する' do
        invalid_series_playlist_id = ['EP6X66M1J'] # 9桁
        expect {
          series_deck.rebuild_playlists_to(invalid_series_playlist_id)
        }.to raise_error(ActiveRecord::RecordInvalid)

        invalid_series_playlist_id = ['EP6X66M1J00'] # 11桁
        expect {
          series_deck.rebuild_playlists_to(invalid_series_playlist_id)
        }.to raise_error(ActiveRecord::RecordInvalid)

        valid_series_playlist_id = ['EP6X66M1J0'] # 10桁
        expect { series_deck.rebuild_playlists_to(valid_series_playlist_id) }.not_to raise_error
      end

      it '大文字半角英数字のseries_playlist_idのみ許可する' do
        invalid_series_playlist_id = ['ep6x66m1j0'] # 小文字
        expect {
          series_deck.rebuild_playlists_to(invalid_series_playlist_id)
        }.to raise_error(ActiveRecord::RecordInvalid)

        invalid_series_playlist_id = ['%P_&66@1J-'] # 特殊文字
        expect {
          series_deck.rebuild_playlists_to(invalid_series_playlist_id)
        }.to raise_error(ActiveRecord::RecordInvalid)

        invalid_series_playlist_id = ['ＥＰ６Ｘ６６Ｍ１Ｊ０'] # 全角
        expect {
          series_deck.rebuild_playlists_to(invalid_series_playlist_id)
        }.to raise_error(ActiveRecord::RecordInvalid)

        valid_series_playlist_id = ['EP6X66M1J0']
        expect { series_deck.rebuild_playlists_to(valid_series_playlist_id) }.not_to raise_error
      end

      it '重複したseries_playlist_idが登録されないこと' do
        invalid_series_playlist_id = %w[EP6X66M1J0 EP6X66M1J0]
        expect {
          series_deck.rebuild_playlists_to(invalid_series_playlist_id)
        }.to raise_error(ActiveRecord::RecordNotUnique)
      end
    end
  end
end
