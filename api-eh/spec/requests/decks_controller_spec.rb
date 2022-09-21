# frozen_string_literal: true

require 'rails_helper'

describe DecksController, type: :request do
  describe 'GET #index' do
    let!(:deck) { create :deck }
    let!(:deck_changed_name) { create :deck, name: '夏デッキ', admin_memo: '冬デッキ' }
    let!(:expected_json) do
      {
        'id' => deck.id,
        'name' => deck.name,
        'description' => deck.description,
        'interfix' => deck.interfix,
        'adminMemo' => deck.admin_memo
      }
    end
    let!(:expected_json_changed_name_and_admin_memo) do
      {
        'id' => deck_changed_name.id,
        'name' => deck_changed_name.name,
        'description' => deck_changed_name.description,
        'interfix' => deck_changed_name.interfix,
        'adminMemo' => deck_changed_name.admin_memo
      }
    end

    before { get decks_url, params: params }

    context '検索クエリが空の場合' do
      let(:params) { { query: '' } }

      it 'データを全件取得できること' do
        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['decks'].length).to eq 2
        expect(json['decks'][0]).to include(expected_json)
        expect(json['decks'][1]).to include(expected_json_changed_name_and_admin_memo)
      end
    end

    context '検索クエリがデッキタイトルおよび管理メモに部分一致する場合' do
      let(:params) { { query: 'デッキ' } }

      it '対象のデータを取得できること' do
        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['decks'].length).to eq 1
        expect(json['decks'][0]).to include(expected_json_changed_name_and_admin_memo)
      end
    end

    context '検索クエリがデッキタイトルのみに部分一致する場合' do
      let(:params) { { query: '夏' } }

      it '対象のデータを取得できること' do
        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['decks'].length).to eq 1
        expect(json['decks'][0]).to include(expected_json_changed_name_and_admin_memo)
      end
    end

    context '検索クエリが管理メモのみに部分一致する場合' do
      let(:params) { { query: '冬' } }

      it '対象のデータを取得できること' do
        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['decks'].length).to eq 1
        expect(json['decks'][0]).to include(expected_json_changed_name_and_admin_memo)
      end
    end

    context 'リクエストにapi_stateが設定されている場合' do
      context 'api_stateがopenの場合' do
        let(:params) { { api_state: 'open' } }
        let(:api_state) { 'open' }

        it '公開ステータスがopenのデッキのみレスポンスで返ってくること' do
          expect(response.status).to eq 200
          json = JSON.parse(response.body)
          json['decks'].each do |d|
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
          json['decks'].each do |d|
            expect(d['apiState']).to eq 'close'
          end
        end
      end
    end
  end

  describe 'GET #show' do
    before do
      json =
        File.open(Rails.root.join('spec/fixtures/payloads/r6.0_l_tvepisode_pl_recommend-tep-0000000055.json')) do |file|
          json_string = file.read
          JSON.parse(json_string, symbolize_names: true)
        end

      poc_client = instance_double(PocApiClient)
      allow(PocApiClient).to receive(:new).and_return(poc_client)
      allow(poc_client).to receive(:playlist_ll_bundle).with(playlist_id: anything).and_return({})
      allow(poc_client).to receive(:available_episode_from_playlist).with(playlist_id: anything).and_return(json)

      get deck_path(deck_id)
    end

    let!(:deck) { create :deck, :with_playlists }

    context '対象のデッキが存在する場合' do
      let(:deck_id) { deck.id }

      it '正常にレスポンスを返すこと' do
        expect(response.status).to eq 200
      end
    end

    context '対象のデッキが存在しない場合' do
      let(:deck_id) { '999_999_999' }

      it 'エラーメッセージが返却されること' do
        expect(response.status).to eq 404
        json = JSON.parse(response.body)
        expect(json['message']).to eq 'デッキが見つかりませんでした'
      end
    end

    context 'with_episode_countが有効の場合' do
      let(:deck_id) { deck.id }
      let(:params) { { with_episode_count: 1 } }

      it '視聴可能なエピソード数が取得できること' do
        get deck_path, params: params

        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json.dig('deck', 'playlists')[0]['playableItemsCount']).to eq 2
      end
    end
  end

  describe 'POST #create' do
    before do
      poc_client = instance_double(PocApiClient)
      allow(PocApiClient).to receive(:new).and_return(poc_client)
      allow(poc_client).to receive(:playlist_ll_bundle)
        .with(playlist_id: anything).and_return({})

      post decks_path, params: input_data
    end

    let!(:deck) { create :deck }
    let!(:playlists) { create_list(:playlist, 2) }
    let!(:input_data) do
      {
        'deck' => {
          'name' => name,
          'interfix' => interfix,
          'playlists' => [
            playlists[0].id
          ]
        }
      }
    end

    context 'name,interfixが設定されている場合' do
      let(:name) { deck.name }
      let(:interfix) { deck.interfix }

      it '対象のデッキが一件新規登録され、デッキに紐づくプレイリストも新規登録されること' do
        expect(response.status).to eq 200
        expect(Deck.count).to eq 2 # deckは事前データの作成で１件登録されているため2件になる
        expect(DeckPlaylist.count).to eq 1
      end
    end

    context 'name,interfixが設定されていない場合' do
      let(:name) { nil }
      let(:interfix) { nil }

      it 'データが保存されず、エラーメッセージが返却されること' do
        expect(response.status).to eq 422
        expect(DeckPlaylist.count).to eq 0
        json = JSON.parse(response.body)
        expect(json['messages']).to eq %w[Nameを入力してください Interfixを入力してください]
      end
    end
  end

  describe 'PUT #update' do
    before do
      poc_client = instance_double(PocApiClient)
      allow(PocApiClient).to receive(:new).and_return(poc_client)
      allow(poc_client).to receive(:playlist_ll_bundle)
        .with(playlist_id: anything).and_return({})
      put deck_path(deck.id), params: updated_data
    end

    let!(:deck) { create :deck, :with_playlists }
    let!(:updated_data) do
      {
        'enable_list_update' => enable_list_update,
        'deck' => {
          'name' => name,
          'interfix' => interfix,
          'playlists' => [
            deck.playlists[0].id
          ]
        }
      }
    end

    context 'name,interfixが設定されている場合' do
      context 'enable_list_updateが1の場合' do
        let(:name) { '更新されました' }
        let(:interfix) { deck.interfix }
        let(:enable_list_update) { '1' }

        it 'データが一件更新されること' do
          expect(response.status).to eq 200
          expect(deck.reload.name).to eq name
          expect(deck.deck_playlists.count).to eq 1 # updated_dataで更新された場合、1件になる
        end
      end

      context 'enable_list_updateがnilの場合' do
        let(:name) { '更新されました' }
        let(:interfix) { deck.interfix }
        let(:enable_list_update) { nil }

        it 'updated_atカラムが更新され、deck_playlistは更新されないこと' do
          expect(response.status).to eq 200
          expect(deck.reload.updated_at).to eq deck.updated_at
          expect(deck.deck_playlists.count).to eq 2 # updated_dataで更新されない場合、Factoryで生成された2件となる
        end
      end
    end

    context 'name,interfixが設定されていない場合' do
      let(:name) { nil }
      let(:interfix) { nil }
      let(:enable_list_update) { '1' }

      it 'データが更新されないこと' do
        expect(response.status).to eq 422
        expect(deck.reload.name).not_to eq nil
        expect(deck.reload.interfix).not_to eq nil
      end
    end
  end

  describe 'DELETE #delete' do
    before { delete "#{decks_path}/#{deck.id}" }

    let!(:deck) { create :deck }

    it '対象のデータが一件削除されること' do
      expect(Deck.count).to eq 0
      expect(response.status).to eq 200
      json = JSON.parse(response.body)
      expect(json['deleted']).to eq true
    end
  end
end
