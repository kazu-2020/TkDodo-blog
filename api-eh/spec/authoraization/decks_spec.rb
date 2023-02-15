# frozen_string_literal: true

require 'rails_helper'

describe 'Deck', type: :request do
  shared_examples '全てのアクセスが認可されること' do
    describe '#index' do
      before { get decks_url }

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#show' do
      before { get deck_url(recommend_deck) }

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#create' do
      before { post decks_url, params: { deck: { name: 'test', interfix: 'something' } } }

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#delete' do
      before { delete deck_url(recommend_deck) }

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#playlists' do
      before { get "/decks/#{recommend_deck.id}/playlists" }

      it do
        expect(response).to have_http_status :ok
      end
    end
  end

  shared_examples '全てのアクセスが認可されないこと' do
    describe '#index' do
      before { get decks_url }

      it do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#show' do
      before { get deck_url(recommend_deck) }

      it do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#create' do
      before { post decks_url, params: { deck: { name: 'test', interfix: 'something' } } }

      it do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#delete' do
      before { delete deck_url(recommend_deck) }

      it do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#playlists' do
      before { get "/decks/#{recommend_deck.id}/playlists" }

      it do
        expect(response).to have_http_status :forbidden
      end
    end
  end

  let(:recommend_deck) { create(:deck) }

  context 'user_admin' do
    before do
      user = create(:user, :user_admin)
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    describe '#index' do
      before { get decks_url }

      it_behaves_like '全てのアクセスが認可されないこと'
    end

    describe '#show' do
      before { get deck_url(recommend_deck) }

      it_behaves_like '全てのアクセスが認可されないこと'
    end

    describe '#create' do
      before do
        poc_client = instance_double(PocApiClient)
        allow(PocApiClient).to receive(:new).and_return(poc_client)
        allow(poc_client).to receive(:playlist_ll_bundle)
          .with(playlist_id: anything).and_return({})

        post decks_url, params: params
      end

      let(:params) { { deck: { name: 'test', interfix: 'something' } } }

      it_behaves_like '全てのアクセスが認可されないこと'
    end

    describe '#delete' do
      before { delete deck_url(recommend_deck) }

      it_behaves_like '全てのアクセスが認可されないこと'
    end

    describe '#playlists' do
      before { get "/decks/#{recommend_deck.id}/playlists" }

      it_behaves_like '全てのアクセスが認可されないこと'
    end
  end

  context 'playlist_admin' do
    before do
      user = create(:user, :playlist_admin)
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    describe '#index' do
      before { get decks_url }

      it_behaves_like '全てのアクセスが認可されないこと'
    end

    describe '#show' do
      before { get deck_url(recommend_deck) }

      it_behaves_like '全てのアクセスが認可されないこと'
    end

    describe '#create' do
      before do
        poc_client = instance_double(PocApiClient)
        allow(PocApiClient).to receive(:new).and_return(poc_client)
        allow(poc_client).to receive(:playlist_ll_bundle)
          .with(playlist_id: anything).and_return({})

        post decks_url, params: params
      end

      let(:params) { { deck: { name: 'test', interfix: 'something' } } }

      it_behaves_like '全てのアクセスが認可されないこと'
    end

    describe '#delete' do
      before { delete deck_url(recommend_deck) }

      it_behaves_like '全てのアクセスが認可されないこと'
    end

    describe '#playlists' do
      before { get "/decks/#{recommend_deck.id}/playlists" }

      it_behaves_like '全てのアクセスが認可されないこと'
    end
  end

  context 'deck_admin' do
    before do
      user = create(:user, :deck_admin)
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    describe '#index' do
      before { get decks_url }

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#show' do
      before { get deck_url(recommend_deck) }

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#create' do
      before do
        poc_client = instance_double(PocApiClient)
        allow(PocApiClient).to receive(:new).and_return(poc_client)
        allow(poc_client).to receive(:playlist_ll_bundle)
          .with(playlist_id: anything).and_return({})

        post decks_url, params: params
      end

      let(:params) { { deck: { name: 'test', interfix: 'something' } } }

      it_behaves_like '全てのアクセスが認可されること'
    end
  end

  context 'reader_user' do
    before do
      user = create(:user, :reader_user)
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    describe '#index' do
      before { get decks_url }

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#show' do
      before { get deck_url(recommend_deck) }

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#create' do
      before do
        poc_client = instance_double(PocApiClient)
        allow(PocApiClient).to receive(:new).and_return(poc_client)
        allow(poc_client).to receive(:playlist_ll_bundle)
          .with(playlist_id: anything).and_return({})

        post decks_url, params: params
      end

      let(:params) { { deck: { name: 'test', interfix: 'something' } } }

      it do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#delete' do
      before { delete deck_url(recommend_deck) }

      it do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#playlists' do
      before { get "/decks/#{recommend_deck.id}/playlists" }

      it do
        expect(response).to have_http_status :forbidden
      end
    end
  end
end
