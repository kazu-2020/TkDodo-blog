# frozen_string_literal: true

require 'rails_helper'

describe SeriesPlaylist, type: :request do
  # 2022/04/25時点でエピソードが存在するseries_idで生成
  let!(:has_episodes) { create(:series_playlist, string_id: 'ts-1V1PJ9L5JN', series_id: '1V1PJ9L5JN') }

  describe '#GET episodes' do
    it '編成されているエピソードの情報が返ってくること' do
      VCR.use_cassette('requests/series_playlists/episodes') do
        get "/series_playlists/#{has_episodes.id}/episodes"

        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['episodes'][0]['identifierGroup']['seriesId']).to eq has_episodes.series_id
      end
    end
  end

  describe '#GET search' do
    context '検索ワードに該当するTVエピソードが存在する場合' do
      let!(:search_params) { { word: 'カムカムエヴリバディ' } }

      it 'TVエピソードが取得できること' do
        VCR.use_cassette('requests/series_playlists/search_return_results') do
          get search_series_playlists_path, params: search_params
          expect(response.status).to eq 200
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

          expect(response.status).to eq 200
          json = JSON.parse(response.body)
          expect(json['count']).to eq 0
          # エラーメッセージのチェックはフロント側でハンドリングしているためテストに含めない
        end
      end
    end
  end
end
