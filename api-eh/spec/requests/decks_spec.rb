# frozen_string_literal: true

require 'rails_helper'

describe DecksController, type: :request do
  describe 'GET #index' do
    let!(:deck) { create :deck }
    let!(:deck_changed_name) { create :deck, name: '夏デッキ', admin_memo: '冬デッキ' }
    let(:expected_json) do
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

    context '検索クエリが送信されなかった場合' do
      it 'データを全件取得できること' do
        get decks_url
        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['decks'].length).to eq 2
        expect(json['decks'][0]).to include(expected_json)
        expect(json['decks'][1]).to include(expected_json_changed_name_and_admin_memo)
      end
    end

    context '検索クエリが空の場合' do
      it 'データを全件取得できること' do
        get decks_url, params: { query: '' }
        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['decks'].length).to eq 2
        expect(json['decks'][0]).to include(expected_json)
        expect(json['decks'][1]).to include(expected_json_changed_name_and_admin_memo)
      end
    end

    context '検索クエリがデッキタイトルおよび管理メモに部分一致する場合' do
      it '対象のデータを取得できること' do
        get decks_url, params: { query: 'デッキ' }
        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['decks'].length).to eq 1
        expect(json['decks'][0]).to include(expected_json_changed_name_and_admin_memo)
      end
    end

    context '検索クエリがデッキタイトルのみに部分一致する場合' do
      it '対象のデータを取得できること' do
        get decks_url, params: { query: '夏' }
        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['decks'].length).to eq 1
        expect(json['decks'][0]).to include(expected_json_changed_name_and_admin_memo)
      end
    end

    context '検索クエリが管理メモのみに部分一致する場合' do
      it '対象のデータを取得できること' do
        get decks_url, params: { query: '冬' }
        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['decks'].length).to eq 1
        expect(json['decks'][0]).to include(expected_json_changed_name_and_admin_memo)
      end
    end
  end
end
