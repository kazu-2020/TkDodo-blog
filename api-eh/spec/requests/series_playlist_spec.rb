# frozen_string_literal: true

require 'rails_helper'

describe SeriesPlaylist do
  before do
    user = create(:user, :deck_admin)
    allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
    allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
  end

  # 2022/04/25時点でエピソードが存在するseries_idで生成
  let!(:has_episodes) { create(:series_playlist, string_id: 'ts-11P91YWWL4', series_id: '11P91YWWL4') }

  describe '#GET episodes' do
    it '編成されているエピソードの情報が返ってくること' do
      VCR.use_cassette('requests/series_playlists/episodes') do
        get "/series_playlists/#{has_episodes.id}/episodes"

        expect(response).to have_http_status :ok
        json = JSON.parse(response.body)
        expect(json['episodes'][0]['identifierGroup']['tvSeriesId']).to eq has_episodes.series_id
      end
    end
  end

  describe '#GET search' do
    context '検索ワードに該当するTVエピソードが存在する場合' do
      let!(:search_params) { { word: 'カムカムエヴリバディ' } }

      it 'TVエピソードが取得できること' do
        VCR.use_cassette('requests/series_playlists/search_return_results') do
          get search_series_playlists_path, params: search_params
          expect(response).to have_http_status :ok
          json = JSON.parse(response.body)
          expect(json['count']).not_to eq 0 # 件数が変動する可能性があるため、0件でないことをチェック
        end
      end
    end

    context '検索ワードに該当するTVエピソードが存在しない場合' do
      let!(:search_params) { { word: 'expected no search results' } }

      it 'TVエピソードが取得されないこと' do
        VCR.use_cassette('requests/series_playlists/search_return_no_results') do
          get search_series_playlists_path, params: search_params

          expect(response).to have_http_status :ok
          json = JSON.parse(response.body)
          expect(json['count']).to eq 0
        end
      end
    end
  end
end
