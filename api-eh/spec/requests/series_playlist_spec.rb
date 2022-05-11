# frozen_string_literal: true

require 'rails_helper'

describe SeriesPlaylist, type: :request do
  # 2022/04/25時点でエピソードが存在しないseries_idで生成
  let!(:has_not_episodes) { create(:series_playlist, string_id: 'ts-5NVVN1G5PJ', series_id: '5NVVN1G5PJ') }
  # 2022/04/25時点でエピソードが存在するseries_idで生成
  let!(:has_episodes) { create(:series_playlist, string_id: 'ts-1V1PJ9L5JN', series_id: '1V1PJ9L5JN') }

  describe '#GET episodes' do
    context 'idに紐づくデータが存在する場合' do
      it 'データが取得できること' do
        VCR.use_cassette('requests/series_playlists/episodes') do
          get "/series_playlists/#{has_episodes.id}/episodes"

          expect(response.status).to eq 200
          json = JSON.parse(response.body)
          expect(json['episodes'][0]['identifierGroup']['seriesId']).to eq has_episodes.series_id
        end
      end
    end

    context 'idに紐づくデータが存在しない場合' do
      it 'データは取得されないが、レスポンスは200として処理されること' do
        VCR.use_cassette('requests/series_playlists/no_episodes') do
          get "/series_playlists/#{has_not_episodes.id}/episodes"

          expect(response.status).to eq 200
          json = JSON.parse(response.body)
          expect(json['episodes'].count).to eq 0
        end
      end
    end
  end

  describe '#GET search' do
    context '検索ワードに該当するデータがある場合' do
      it 'データが取得できること' do
        VCR.use_cassette('requests/series_playlists/search_return_results') do
          get search_series_playlists_path, params: { word: 'カムカムエヴリバディ' }

          expect(response.status).to eq 200
          json = JSON.parse(response.body)
          expect(json['count']).not_to eq 0 # 件数が変動する可能性があるため、0件でないことをチェック
        end
      end
    end

    context '検索ワードに該当するデータが無い場合' do
      it 'データは取得されないが、レスポンスは200として処理されること' do
        VCR.use_cassette('requests/series_playlists/search_return_no_results') do
          get search_series_playlists_path, params: { word: 'expected no search results' }

          expect(response.status).to eq 200
          json = JSON.parse(response.body)
          expect(json['count']).to eq 0
          # エラーメッセージはフロント側でハンドリングしているためテストに含めない
        end
      end
    end
  end
end
