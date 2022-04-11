# frozen_string_literal: true

require 'rails_helper'

describe DecksController, type: :request do
  describe 'GET #index' do
    context '画面初期表示をした場合' do
      let!(:deck) { create :deck }
      let(:expected_json) do
        {
          'id' => deck.id.to_s.to_i,
          'name' => deck.name.to_s,
          'description' => deck.description.to_s,
          'interfix' => deck.interfix.to_s,
          'adminMemo' => deck.admin_memo.to_s
        }
      end
      it '全件取得できること' do
        get decks_url
        json = JSON.parse(response.body)
        expect(response.status).to eq 200
        expect(json['decks'].length).to eq 1
      end
      it 'レスポンスボディに任意のデータが含まれること' do
        get decks_url
        json = JSON.parse(response.body)
        p json['decks'][0]
        p expected_json
        expect(json['decks'][0]).to include(expected_json)
      end
    end

    context '検索処理を実行した場合' do
      let!(:deck) { create :deck }
      let!(:deck_changed_name) { create :deck, name: '夏デッキ', admin_memo: '冬デッキ' }
      let(:expected_json_default) do
        {
          'id' => deck.id.to_s.to_i,
          'name' => deck.name.to_s,
          'description' => deck.description.to_s,
          'interfix' => deck.interfix.to_s,
          'adminMemo' => deck.admin_memo.to_s
        }
      end
      let(:expected_json_changed_name_and_admin_memo) do
        {
          'id' => deck_changed_name.id.to_s.to_i,
          'name' => deck_changed_name.name.to_s,
          'description' => deck_changed_name.description.to_s,
          'interfix' => deck_changed_name.interfix.to_s,
          'adminMemo' => deck_changed_name.admin_memo.to_s
        }
      end
      context '検索条件がない場合' do
        it '全件返却されること' do
          get '/decks', params: { query: '' }
          json = JSON.parse(response.body)
          expect(response.status).to eq 200
          expect(json['decks'].length).to eq 2
        end

        it 'レスポンスボディに任意のデータが含まれること' do
          get decks_url
          json = JSON.parse(response.body)
          expect(json['decks'][0]).to include(expected_json_default)
          expect(json['decks'][1]).to include(expected_json_changed_name_and_admin_memo)
        end
      end

      context '検索条件がある場合' do
        it 'デッキタイトルおよび管理メモに部分一致する場合' do
          get '/decks', params: { query: 'デッキ' }
          json = JSON.parse(response.body)
          expect(response.status).to eq 200
          expect(json['decks'].length).to eq 1
        end

        it 'レスポンスボディに任意のデータが含まれること' do
          get decks_url, params: { query: 'デッキ' }
          json = JSON.parse(response.body)
          p json
          expect(json['decks'][0]).to include(expected_json_changed_name_and_admin_memo)
        end

        it 'デッキタイトルのみに部分一致する場合' do
          get decks_url, params: { query: '夏' }
          json = JSON.parse(response.body)
          expect(json['decks'].length).to eq 1
        end

        it 'レスポンスボディに任意のデータが含まれること' do
          get decks_url, params: { query: '夏' }
          json = JSON.parse(response.body)
          expect(json['decks'][0]).to include(expected_json_changed_name_and_admin_memo)
        end

        it '管理メモのみに部分一致する場合' do
          get decks_url, params: { query: '冬' }
          json = JSON.parse(response.body)
          expect(json['decks'].length).to eq 1
        end

        it 'レスポンスボディに任意のデータが含まれること' do
          get decks_url, params: { query: '冬' }
          json = JSON.parse(response.body)
          expect(json['decks'][0]).to include(expected_json_changed_name_and_admin_memo)
        end
      end
    end
  end
end
