# frozen_string_literal: true

require 'rails_helper'

describe DecksController, type: :request do
  let!(:deck) { create :deck }
  let(:expected_json) do
    {
      'id' => deck.id,
      'name' => deck.name.to_s,
      'description' => deck.description.to_s,
      'interfix' => deck.interfix.to_s,
      'adminMemo' => deck.admin_memo.to_s
    }
  end

  describe 'GET #index' do
    let!(:deck_changed_name) { create :deck, name: '夏デッキ', admin_memo: '冬デッキ' }
    let(:expected_json_changed_name_and_admin_memo) do
      {
        'id' => deck_changed_name.id,
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

    context 'パラメータにapi_stateが含まれる場合' do
      context 'api_stateがopenの場合' do
        before { create(:deck, api_state: 'open') }

        let(:params) { { api_state: 'open' } }

        it '公開ステータスがopenとなること' do
          get decks_url, params: params
          expect(response.status).to eq 200
          json = JSON.parse(response.body)
          expect(json['decks'][0]['apiState']).to eq 'open'
        end
      end

      context 'api_stateがcloseの場合' do
        before { create(:deck, api_state: 'close') }

        let(:params) { { api_state: 'close' } }

        it '公開ステータスがcloseとなること' do
          get decks_url, params: params
          expect(response.status).to eq 200
          json = JSON.parse(response.body)
          expect(json['decks'][0]['apiState']).to eq 'close'
        end
      end
    end
  end

  describe 'GET #show' do
    let(:deck) { create(:deck, :with_playlists) }

    before do
      json = File.open(Rails.root.join('spec/fixtures/payloads/te_PG3Z16Q145.json')) do |file|
        json_string = file.read
        JSON.parse(json_string, symbolize_names: true)
      end
      dlab_client = instance_double(DlabApiClient)
      allow(DlabApiClient).to receive(:new).and_return(dlab_client)
      allow(dlab_client).to receive(:episode_l_bundle).with(type: 'tv', episode_id: anything).and_return(json)
      allow(dlab_client).to receive(:episode_list_bundle).with(type: 'tv', episode_id: anything).and_return({})
    end

    context '対象のデッキが存在する場合' do
      it '正常にレスポンスを返すこと' do
        get deck_path(deck)
        expect(response.status).to eq 200
      end
    end

    context '対象のデッキが存在しない場合' do
      it 'エラーメッセージが返却されること' do
        get deck_path(deck.id + 1)
        expect(response.status).to eq 404
        json = JSON.parse(response.body)
        expect(json['message']).to eq 'デッキが見つかりませんでした'
      end
    end
  end

  describe 'POST #create' do
    let!(:playlists) { create_list(:playlist, 2) }
    let(:input_data) do
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

    context 'name,interfixプロパティに値が存在する場合' do
      let(:name) { deck.name }
      let(:interfix) { deck.interfix }

      it '対象のデッキが一件新規登録され、デッキに紐づくプレイリストも新規登録されること' do
        expect do
          post decks_path, params: input_data
        end.to change(Deck, :count).from(1).to(2)

        expect do
          post decks_path, params: input_data
        end.to change(DeckPlaylist, :count).from(1).to(2)

        expect(response.status).to eq 200
      end
    end

    context 'name,interfixプロパティに値が存在しない場合' do
      let(:name) { nil }
      let(:interfix) { nil }

      it 'データが保存されないこと' do
        post decks_path, params: input_data
        expect(response.status).to eq 422
        expect(DeckPlaylist.count).to eq 0
        json = JSON.parse(response.body)
        expect(json['messages']).to eq %w[Nameを入力してください Interfixを入力してください]
      end
    end
  end

  describe 'PUT #update' do
    let!(:deck) { create :deck, :with_playlists }
    let(:updated_data) do
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

    context 'name,interfixプロパティに値が存在する場合' do
      context 'enable_list_updateが存在する場合' do
        let(:name) { '更新されました' }
        let(:interfix) { deck.interfix }
        let(:enable_list_update) { '1' }

        it 'データが一件更新されること' do
          expect do
            put "#{decks_path}/#{deck.id}", params: updated_data
          end.to change(DeckPlaylist, :count).from(2).to(1)
          expect(response.status).to eq(200)
          expect(deck.reload.name).to eq(name)
          expect(deck.deck_playlists.count).to eq 1
        end
      end

      context 'enable_list_updateがnilの場合' do
        let(:name) { '更新されました' }
        let(:interfix) { deck.interfix }
        let(:enable_list_update) { nil }

        it 'updated_atカラムが更新され、deck_playlistは更新されないこと' do
          put "#{decks_path}/#{deck.id}", params: updated_data
          expect(response.status).to eq(200)
          expect(deck.reload.updated_at).to eq(deck.updated_at)
          expect(deck.deck_playlists.count).to eq 2
        end
      end
    end

    context 'name,interfixプロパティに値が存在しない場合' do
      let(:name) { nil }
      let(:interfix) { nil }
      let(:enable_list_update) { '1' }

      it 'データが更新されないこと' do
        put "#{decks_path}/#{deck.id}", params: updated_data
        expect(response.status).to eq(422)
        expect(deck.reload.name).not_to eq(nil)
        expect(deck.reload.interfix).not_to eq(nil)
      end
    end
  end

  describe 'DELETE #delete' do
    let!(:deck) { create :deck }

    it '対象のデータが一件削除されること' do
      expect do
        delete "#{decks_path}/#{deck.id}"
      end.to change(Deck, :count).from(1).to(0)
      expect(response.status).to eq(200)
      json = JSON.parse(response.body)
      expect(json['deleted']).to eq true
    end
  end
end
