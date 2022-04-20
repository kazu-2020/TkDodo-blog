# frozen_string_literal: true

require 'rails_helper'

describe SeriesPlaylist, type: :request do
  let(:series_id) { 'Y3XNWR54KL' }
  let(:string_id) { "ts-#{series_id}" }
  let!(:series_playlist) { create(:series_playlist, string_id: string_id, series_id: series_id) }

  describe '#GET episodes' do
    it '正常にレスポンスが返ってくること' do
      get "/series_playlists/#{series_playlist.id}/episodes"
      expect(response.status).to eq 200
    end
  end

  describe '#GET search' do
    it '正常にレスポンスが返ってくること' do
      VCR.use_cassette('requests/series_playlists/search_path') do
        get '/series_playlists/search'
        expect(response.status).to eq 200
      end
    end
  end
end
