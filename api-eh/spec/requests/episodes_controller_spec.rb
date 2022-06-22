# frozen_string_literal: true

require 'rails_helper'

describe EpisodesController, type: :request do
  let!(:merged_params) { { contents_type: contents } }

  describe 'GET #search' do
    before { create(:playlist_item) }

    context 'エピソード検索の場合' do
      let(:contents) { 'tvepisode' }

      it '正常にレスポンスが返ってくること' do
        VCR.use_cassette('requests/episode_spec/search_episodes') do
          get search_episodes_path, params: merged_params
          json = JSON.parse(response.body)
          expect(json['items'][0]['type']).to eq 'TVEpisode'
          expect(response.status).to eq 200
        end
      end

      context 'ページングを読み込んだ場合' do
        let(:offset) { { offset: 10 } }

        it '正常にレスポンスが返ってくること' do
          VCR.use_cassette('requests/episode_spec/search_episodes_paging') do
            get search_episodes_path, params: merged_params.merge(offset)
            expect(response.status).to eq 200
          end
        end
      end

      context 'G or Eのエピソードのみ検索をした場合' do
        let(:service) { { service: 'g1,g2,e1,e3' } }

        it '正常にレスポンスが返ってくること' do
          VCR.use_cassette('requests/episode_spec/search_episodes_service') do
            get search_episodes_path, params: merged_params.merge(service)
            expect(response.status).to eq 200
          end
        end
      end
    end

    context 'シリーズ検索の場合' do
      let(:contents) { 'tvseries' }
      let(:word) { { word: 'ブラタモリ' } } # 20220617： 視聴可能なビデオを含まないシリーズの場合404となるため、視聴可能なビデオを含むシリーズを引くwordを設定。

      it '正常にレスポンスが返ってくること' do
        VCR.use_cassette('requests/episode_spec/search_episodes_in_series') do
          get search_episodes_path, params: merged_params.merge(word)
          json = JSON.parse(response.body)
          expect(json['items'][0]['type']).to eq 'TVSeries'
          expect(response.status).to eq 200
        end
      end

      context 'シリーズのページングを読み込んだ場合' do
        let(:offset) { { offset: 10 } }

        it '正常にレスポンスが返ってくること' do
          VCR.use_cassette('requests/episode_spec/search_series_paging') do
            get search_episodes_path, params: merged_params.merge(offset)
            expect(response.status).to eq 200
          end
        end
      end

      context 'シリーズ内のエピソードのページングを読み込んだ場合' do
        let(:series_id) { { series_id: 'W6LNXPQPY7' } } # 20220617時点で11件以上エピソードを含むシリーズ
        let(:offset) { { offset: 10 } }

        it '正常にレスポンスが返ってくること' do
          VCR.use_cassette('requests/episode_spec/search_episode_in_series_paging') do
            get search_episodes_path, params: merged_params.merge(series_id, offset)
            expect(response.status).to eq 200
          end
        end
      end

      context 'G or Eのエピソードのみ検索をした場合' do
        let(:service) { { vService: 'g1,g2,e1,e3' } }

        it '正常にレスポンスが返ってくること' do
          VCR.use_cassette('requests/episode_spec/search_series_service') do
            get search_episodes_path, params: merged_params.merge(word, service)
            expect(response.status).to eq 200
          end
        end
      end
    end
  end
end
