# frozen_string_literal: true

require 'rails_helper'

describe 'Episodes', type: :request do
  shared_examples '全てのアクセスが認可されること' do
    describe '#search' do
      before { get search_episodes_path, params: { contents_type: 'tvepisode' } }

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#bundle' do
      before { get '/episodes/PG3Z16Q145/bundle' }

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#playlists' do
      before { get '/episodes/PG3Z16Q145/playlists' }

      it do
        expect(response).to have_http_status :ok
      end
    end
  end

  shared_examples '全てのアクセスが認可されないこと' do
    describe '#search' do
      before { get search_episodes_path, params: { contents_type: 'tvepisode' } }

      it do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#bundle' do
      before { get '/episodes/PG3Z16Q145/bundle' }

      it do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#playlists' do
      before { get '/episodes/PG3Z16Q145/playlists' }

      it do
        expect(response).to have_http_status :forbidden
      end
    end
  end

  before do
    search_result = File.open(Rails.root.join('spec/fixtures/payloads/r6/s_extended.json')) do |f|
      JSON.parse(f.read, symbolize_names: true)
    end

    dlab_api_client = instance_double(DlabApiClient)
    allow(DlabApiClient).to receive(:new).and_return(dlab_api_client)
    allow(dlab_api_client).to receive(:search).and_return(search_result)
    allow(dlab_api_client).to receive(:episode_l_bundle).with(type: 'tv', episode_id: 'PG3Z16Q145',
                                                              query: { size: 10 }).and_return({})
  end

  describe 'super_admin' do
    before do
      user = create(:user, :super_admin)
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    it_behaves_like '全てのアクセスが認可されること'
  end

  describe 'user_admin' do
    before do
      user = create(:user, :user_admin)
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    it_behaves_like '全てのアクセスが認可されないこと'
  end

  describe 'playlist_admin' do
    before do
      user = create(:user, :playlist_admin)
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    it_behaves_like '全てのアクセスが認可されること'
  end

  describe 'deck_admin' do
    before do
      user = create(:user, :deck_admin)
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    it_behaves_like '全てのアクセスが認可されないこと'
  end

  describe 'reader_user' do
    before do
      user = create(:user, :reader_user)
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    describe '#search' do
      before { get search_episodes_path, params: { contents_type: 'tvepisode' } }

      it do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#bundle' do
      before { get '/episodes/PG3Z16Q145/bundle' }

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#playlists' do
      before { get '/episodes/PG3Z16Q145/playlists' }

      it do
        expect(response).to have_http_status :forbidden
      end
    end
  end
end
