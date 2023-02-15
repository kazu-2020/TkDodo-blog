# frozen_string_literal: true

require 'rails_helper'

describe 'PlaylistItem', type: :request do
  shared_examples '全てのアクセスが認可されること' do
    describe '#index' do
      let(:playlist) {
        create(:playlist, id: '52', playlist_items: [playlist_item])
      } # playlist_string_idはidから生成されるため、idはstubに合わせて固定値にする
      let(:playlist_item) { create(:playlist_item, episode_id: stub_episode_id) }

      before { get "/playlists/#{playlist.id}/playlist_items" }

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#bulk_update' do
      let(:playlist) { create(:playlist) }
      let(:params) { { playlist_items: episode_ids } }
      let(:stub_episode_id) { 'NEWEP1' }
      let(:episode_ids) { [{ id: stub_episode_id }] }

      before { post "/playlists/#{playlist.string_uid}/playlist_items/bulk_update", params: params }

      it do
        expect(response).to have_http_status :ok
      end
    end
  end

  shared_examples '全てのアクセスが認可されないこと' do
    describe '#index' do
      let(:playlist) {
        create(:playlist, id: '52', playlist_items: [playlist_item])
      } # playlist_string_idはidから生成されるため、idはstubに合わせて固定値にする
      let(:playlist_item) { create(:playlist_item, episode_id: stub_episode_id) }

      before { get "/playlists/#{playlist.id}/playlist_items" }

      it do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#bulk_update' do
      let(:playlist) { create(:playlist) }
      let(:params) { { playlist_items: episode_ids } }
      let(:stub_episode_id) { 'NEWEP1' }
      let(:episode_ids) { [{ id: stub_episode_id }] }

      before { post "/playlists/#{playlist.string_uid}/playlist_items/bulk_update" }

      it do
        expect(response).to have_http_status :forbidden
      end
    end
  end

  before do
    l_bundle_json = File.open(Rails.root.join('spec/fixtures/payloads/l_bundle_te_PG3Z16Q145.json')) do |file|
      json_string = file.read
      JSON.parse(json_string, symbolize_names: true)
    end

    t_json = File.open(Rails.root.join('spec/fixtures/payloads/t_te_PG3Z16Q145.json')) do |file|
      json_string = file.read
      JSON.parse(json_string, symbolize_names: true)
    end

    dlab_client = instance_double(DlabApiClient)
    allow(DlabApiClient).to receive(:new).and_return(dlab_client)
    allow(dlab_client).to receive(:episode_l_bundle).with(type: 'tv',
                                                          episode_id: stub_episode_id).and_return(l_bundle_json)
    allow(dlab_client).to receive(:episode).with(type: 'tv', episode_id: stub_episode_id).and_return(t_json)

    poc_client = instance_double(PocApiClient)
    allow(PocApiClient).to receive(:new).and_return(poc_client)
    allow(poc_client).to receive(:episode).with(episode_id: anything).and_return({})
    allow(poc_client).to receive(:playlist_ll_bundle).with(playlist_id: anything).and_return({})
  end

  let(:stub_episode_id) { 'PG3Z16Q145' }

  describe 'system roles' do
    context 'user_admin' do
      before do
        user = create(:user, :user_admin)
        allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
        allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
      end

      it_behaves_like '全てのアクセスが認可されないこと'
    end

    context 'playlist_admin' do
      before do
        user = create(:user, :playlist_admin)
        allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
        allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
      end

      it_behaves_like '全てのアクセスが認可されること'
    end

    context 'deck_admin' do
      before do
        user = create(:user, :deck_admin)
        allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
        allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
      end

      it_behaves_like '全てのアクセスが認可されないこと'
    end

    context 'reader_user' do
      before do
        user = create(:user, :reader_user)
        allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
        allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
      end

      describe '#index' do
        let(:playlist) {
          create(:playlist, id: '52', playlist_items: [playlist_item])
        } # playlist_string_idはidから生成されるため、idはstubに合わせて固定値にする
        let(:playlist_item) { create(:playlist_item, episode_id: stub_episode_id) }

        before { get "/playlists/#{playlist.id}/playlist_items" }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#bulk_update' do
        let(:playlist) { create(:playlist) }
        let(:params) { { playlist_items: episode_ids } }
        let(:stub_episode_id) { 'NEWEP1' }
        let(:episode_ids) { [{ id: stub_episode_id }] }

        before { post "/playlists/#{playlist.string_uid}/playlist_items/bulk_update" }

        it do
          expect(response).to have_http_status :forbidden
        end
      end
    end
  end

  describe 'recommend_playlist roles' do
    let(:playlist) {
      create(:playlist, id: '52', playlist_items: [playlist_item]) # playlist_string_idはidから生成されるため、idはstubに合わせて固定値にする
    }
    let(:playlist_item) { create(:playlist_item, episode_id: stub_episode_id) }
    let(:user) { create(:user, :user_admin) } # ユーザー管理者はプレイリストに関する権限を持たない
    let(:stub_episode_id) { 'NEWEP1' }
    let(:episode_ids) { [{ id: stub_episode_id }] }
    let(:params) { { playlist_items: episode_ids } }

    before do
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    context '代表承認者' do
      before { user.add_role(:manager, playlist) }

      it_behaves_like '全てのアクセスが認可されること'
    end

    context '承認者' do
      before { user.add_role(:approver, playlist) }

      it_behaves_like '全てのアクセスが認可されること'
    end

    context '入力者' do
      before { user.add_role(:editor, playlist) }

      it_behaves_like '全てのアクセスが認可されること'
    end

    context '閲覧者' do
      before { user.add_role(:reader, playlist) }

      describe '#index' do
        before { get "/playlists/#{playlist.id}/playlist_items" }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#bulk_update' do
        before { post "/playlists/#{playlist.string_uid}/playlist_items/bulk_update" }

        it do
          expect(response).to have_http_status :forbidden
        end
      end
    end
  end
end
