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
      let(:params) { { query: '' } }

      it 'データを全件取得できること' do
        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['series_decks'].length).to eq 2
        expect(json['series_decks'][0]).to include(expected_json)
        expect(json['series_decks'][1]).to include(expected_json_changed_name_and_admin_memo)
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
end
