# frozen_string_literal: true

require 'rails_helper'

describe 'SeriesPlaylist', type: :request do
  shared_examples '全てのアクセスが認可されること' do
    describe '#episodes' do
      before { get "/series_playlists/#{series_playlist.id}/episodes" }

      it '認可されること' do
        expect(response).to have_http_status :ok
      end
    end

    describe '#search' do
      before { get '/series_playlists/search' }

      it '認可されること' do
        expect(response).to have_http_status :ok
      end
    end
  end

  shared_examples '全てのアクセスが認可されないこと' do
    describe '#episodes' do
      before { get "/series_playlists/#{series_playlist.id}/episodes" }

      it '認可されないこと' do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#search' do
      before { get '/series_playlists/search' }

      it '認可されないこと' do
        expect(response).to have_http_status :forbidden
      end
    end
  end

  before do
    search_result = File.open(Rails.root.join('spec/fixtures/payloads/r6/s_extended.json')) do |f|
      JSON.parse(f.read, symbolize_names: true)
    end

    dlab_client = instance_double(DlabApiClient)
    allow(DlabApiClient).to receive(:new).and_return(dlab_client)
    allow(dlab_client).to receive(:episode_from_series).and_return({})
    allow(dlab_client).to receive(:search).and_return(search_result)
  end

  describe 'user_admin' do
    let(:series_playlist) { create(:series_playlist) }

    before do
      user = create(:user, :user_admin)
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    it_behaves_like '全てのアクセスが認可されないこと'
  end

  describe 'playlist_admin' do
    let(:series_playlist) { create(:series_playlist) }

    before do
      user = create(:user, :playlist_admin)
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    it_behaves_like '全てのアクセスが認可されないこと'
  end

  describe 'deck_admin' do
    let(:series_playlist) { create(:series_playlist) }

    before do
      user = create(:user, :deck_admin)
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    it_behaves_like '全てのアクセスが認可されること'
  end

  describe 'reader_user' do
    let(:series_playlist) { create(:series_playlist) }

    before do
      user = create(:user, :reader_user)
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    describe '#episodes' do
      before { get "/series_playlists/#{series_playlist.id}/episodes" }

      it '認可されること' do
        expect(response).to have_http_status :ok
      end
    end

    describe '#search' do
      before { get '/series_playlists/search' }

      it '認可されないこと' do
        expect(response).to have_http_status :forbidden
      end
    end
  end
end
