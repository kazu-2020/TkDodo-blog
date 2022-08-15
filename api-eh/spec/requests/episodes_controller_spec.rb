# frozen_string_literal: true

require 'rails_helper'

describe EpisodesController, type: :request do
  describe 'GET #search' do
    let!(:search_params) { { contents_type: contents } }

    before { create(:playlist_item) }

    context 'エピソード検索の場合' do
      let(:contents) { 'tvepisode' }

      it '正常にレスポンスが返ってくること' do
        VCR.use_cassette('requests/episode_spec/search_episodes') do
          get search_episodes_path, params: search_params
          json = JSON.parse(response.body)
          expect(json['items'][0]['type']).to eq 'TVEpisode'
          expect(response.status).to eq 200
        end
      end

      context 'ページングを読み込んだ場合' do
        let(:offset) { { offset: 10 } }

        it '正常にレスポンスが返ってくること' do
          VCR.use_cassette('requests/episode_spec/search_episodes_paging') do
            get search_episodes_path, params: search_params.merge(offset)
            expect(response.status).to eq 200
          end
        end
      end

      context 'G or Eのエピソードのみ検索をした場合' do
        let(:service) { { service: 'g1,g2,e1,e3' } }

        it '正常にレスポンスが返ってくること' do
          VCR.use_cassette('requests/episode_spec/search_episodes_service') do
            get search_episodes_path, params: search_params.merge(service)
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
          get search_episodes_path, params: search_params.merge(word)
          json = JSON.parse(response.body)
          expect(json['items'][0]['type']).to eq 'TVSeries'
          expect(response.status).to eq 200
        end
      end

      context 'シリーズのページングを読み込んだ場合' do
        let(:offset) { { offset: 10 } }

        it '正常にレスポンスが返ってくること' do
          VCR.use_cassette('requests/episode_spec/search_series_paging') do
            get search_episodes_path, params: search_params.merge(offset)
            expect(response.status).to eq 200
          end
        end
      end

      context 'シリーズ内のエピソードのページングを読み込んだ場合' do
        let(:series_id) { { series_id: 'W6LNXPQPY7' } } # 20220617時点で11件以上エピソードを含むシリーズ
        let(:offset) { { offset: 10 } }

        it '正常にレスポンスが返ってくること' do
          VCR.use_cassette('requests/episode_spec/search_episode_in_series_paging') do
            get search_episodes_path, params: search_params.merge(series_id, offset)
            expect(response.status).to eq 200
          end
        end
      end

      context 'G or Eのエピソードのみ検索をした場合' do
        let(:service) { { vService: 'g1,g2,e1,e3' } }

        it '正常にレスポンスが返ってくること' do
          VCR.use_cassette('requests/episode_spec/search_series_service') do
            get search_episodes_path, params: search_params.merge(word, service)
            expect(response.status).to eq 200
          end
        end
      end
    end

    context 'プレイリスト検索の場合' do
      let(:contents) { 'nplaylist' }
      let(:word) { { word: '鎌倉殿の旬' } } # 20220622： 視聴可能なビデオを含まないプレイリストの場合404となるため、視聴可能なビデオを含むプレイリストを引くwordを設定。

      it '正常にレスポンスが返ってくること' do
        VCR.use_cassette('requests/episode_spec/search_episodes_in_playlists') do
          get search_episodes_path, params: search_params.merge(word)
          json = JSON.parse(response.body)
          expect(json['items'][0]['type']).to eq 'NPlaylist'
          expect(response.status).to eq 200
        end
      end

      context 'プレイリストのページングを読み込んだ場合' do
        let(:offset) { { offset: 10 } }

        it '正常にレスポンスが返ってくること' do
          VCR.use_cassette('requests/episode_spec/search_playlists_paging') do
            get search_episodes_path, params: search_params.merge(word, offset)
            expect(response.status).to eq 200
          end
        end
      end

      context 'プレイリスト内のエピソードのページングを読み込んだ場合' do
        let(:playlist_id) { { playlist_id: 'recommend-tep-0000000055' } } # 20220622時点で11件以上エピソードを含むプレイリスト
        let(:offset) { { offset: 10 } }

        it '正常にレスポンスが返ってくること' do
          VCR.use_cassette('requests/episode_spec/search_episode_in_playlists_paging') do
            get search_episodes_path, params: search_params.merge(word, playlist_id, offset)
            expect(response.status).to eq 200
          end
        end
      end
    end
  end

  describe 'GET #bundle_items' do
    before { create(:playlist, id: playlist_id) }

    let(:playlist_id) { 52 }
    let(:playlist_string_id) { 'recommend-tep-0000000052' }# 20220801時点で各エピソードタイプを含むプレイリスト
    let(:expected_json) do
      {
        'event' => 9,
        'faqpage' => 2,
        'howto' => 7,
        'tvepisode' => 9
        # TODO: Recipeを追加すること
      }
    end

    it '各Subtypeのカウントが取得できること' do
      VCR.use_cassette('requests/episode_spec/bundle_items') do
        get bundle_items_episodes_path(playlist_id: playlist_string_id)
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)).to eq expected_json
      end
    end
  end
end
