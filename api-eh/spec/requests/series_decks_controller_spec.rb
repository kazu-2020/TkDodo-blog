# frozen_string_literal: true

require 'rails_helper'

describe SeriesDecksController, type: :request do
  describe 'GET #index' do
    let!(:series_deck) { create :series_deck }
    let!(:series_deck_changed_name) { create :series_deck, name: '夏デッキ', admin_memo: '冬デッキ' }
    let!(:expected_json) do
      {
        'id' => series_deck.id,
        'name' => series_deck.name,
        'description' => series_deck.description,
        'interfix' => series_deck.interfix,
        'adminMemo' => series_deck.admin_memo
      }
    end
    let!(:expected_json_changed_name_and_admin_memo) do
      {
        'id' => series_deck_changed_name.id,
        'name' => series_deck_changed_name.name,
        'description' => series_deck_changed_name.description,
        'interfix' => series_deck_changed_name.interfix,
        'adminMemo' => series_deck_changed_name.admin_memo
      }
    end

    before { get series_decks_url, params: params }

    context '検索クエリが空の場合' do
      let(:params) { { query: '', with_subtype_item_count: '0' } }

      it 'データを全件取得できること' do
        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['series_decks'].length).to eq 2
        expect(json['series_decks'][0]).to include(expected_json)
        expect(json['series_decks'][1]).to include(expected_json_changed_name_and_admin_memo)
      end

      it 'サブタイプが取得されないこと' do
        json = JSON.parse(response.body)
        expect(json['series_decks'][0].keys).not_to include('tvepisodeCount', 'howtoCount', 'faqpageCount',
                                                            'eventCount', 'recipeCount')
        expect(json['series_decks'][1].keys).not_to include('tvepisodeCount', 'howtoCount', 'faqpageCount',
                                                            'eventCount', 'recipeCount')
      end
    end

    context '検索クエリがデッキタイトルおよび管理メモに部分一致する場合' do
      let(:params) { { query: 'デッキ' } }

      it '対象のデータを取得できること' do
        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['series_decks'].length).to eq 1
        expect(json['series_decks'][0]).to include(expected_json_changed_name_and_admin_memo)
      end
    end

    context '検索クエリがデッキタイトルのみに部分一致する場合' do
      let(:params) { { query: '夏' } }

      it '対象のデータを取得できること' do
        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['series_decks'].length).to eq 1
        expect(json['series_decks'][0]).to include(expected_json_changed_name_and_admin_memo)
      end
    end

    context '検索クエリが管理メモのみに部分一致する場合' do
      let(:params) { { query: '冬' } }

      it '対象のデータを取得できること' do
        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['series_decks'].length).to eq 1
        expect(json['series_decks'][0]).to include(expected_json_changed_name_and_admin_memo)
      end
    end

    context 'リクエストにapi_stateが設定されている場合' do
      context 'api_stateがopenの場合' do
        let(:params) { { api_state: 'open' } }
        let(:api_state) { 'open' }

        it '公開ステータスがopenのデッキのみレスポンスで返ってくること' do
          expect(response.status).to eq 200
          json = JSON.parse(response.body)
          json['series_decks'].each do |d|
            expect(d['apiState']).to eq 'open'
          end
        end
      end

      context 'api_stateがcloseの場合' do
        let(:params) { { api_state: 'close' } }
        let(:api_state) { 'close' }

        it '公開ステータスがcloseのデッキのみレスポンスで返ってくること' do
          expect(response.status).to eq 200
          json = JSON.parse(response.body)
          json['series_decks'].each do |d|
            expect(d['apiState']).to eq 'close'
          end
        end
      end
    end
  end

  describe 'GET #show' do
    let!(:series_playlist) { create :series_playlist, string_id: 'ts-M33W1P3PLZ', series_id: 'M33W1P3PLZ' }
    let!(:series_deck) { create :series_deck, series_playlists: [series_playlist] }
    let(:params) { { with_subtype_item_count: '1' } }

    before do
      t_tvseries_json = File.open('spec/fixtures/payloads/r6_t_tvseries_ts_M33W1P3PLZ.json') do |file|
        json_string = file.read
        JSON.parse(json_string, symbolize_names: true)
      end

      dlab_client = instance_double(DlabApiClient)
      allow(DlabApiClient).to receive(:new).and_return(dlab_client)
      allow(dlab_client).to receive(:series).with(type: 'tv', series_id: 'M33W1P3PLZ').and_return(t_tvseries_json)
      allow(dlab_client).to receive(:series_ll_bundle_types).with(type: 'tv', series_id: anything).and_return({})

      get series_deck_path(series_deck.id), params: params
    end

    it 'デッキの詳細情報が取得できること' do
      expect(response.status).to eq 200
      json = JSON.parse(response.body)
      expect(json['deck']['id']).to eq series_deck.id
      expect(json['deck']['name']).to eq series_deck.name
      expect(json['deck']['description']).to eq series_deck.description
      expect(json['deck']['interfix']).to eq series_deck.interfix
      expect(json['deck']['adminMemo']).to eq series_deck.admin_memo
    end

    it 'サブタイプが取得されること' do
      json = JSON.parse(response.body)
      expect(json.dig('deck',
                      'playlists')[0].keys).to include('tvepisodeCount', 'howtoCount', 'faqpageCount', 'eventCount',
                                                       'recipeCount')
    end
  end
end
