# frozen_string_literal: true

require 'rails_helper'

describe 'SeriesDeck', type: :request do
  shared_examples '全てのアクセスが認可されること' do
    describe '#index' do
      before { get series_decks_url }

      it '認可されること' do
        expect(response).to have_http_status :ok
      end
    end

    describe '#show' do
      let!(:series_deck) { create(:series_deck) }

      before { get series_deck_url(series_deck.id) }

      it '認可されること' do
        expect(response).to have_http_status :ok
      end
    end

    describe '#create' do
      before { post series_decks_url, params: { series_deck: { name: 'test', interfix: 'something' } } }

      it '認可されること' do
        expect(response).to have_http_status :ok
      end
    end

    describe '#update' do
      let!(:series_deck) { create(:series_deck) }

      before { patch series_deck_url(series_deck.id), params: { series_deck: { name: 'updated' } } }

      it '認可されること' do
        expect(response).to have_http_status :ok
      end
    end

    describe '#destroy' do
      let!(:series_deck) { create(:series_deck) }

      before { delete series_deck_url(series_deck.id) }

      it '認可されること' do
        expect(response).to have_http_status :ok
      end
    end
  end

  shared_examples '全てのアクセスが認可されないこと' do
    describe '#index' do
      before { get series_decks_url }

      it '認可されないこと' do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#show' do
      let!(:series_deck) { create(:series_deck) }

      before { get series_deck_url(series_deck.id) }

      it '認可されないこと' do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#create' do
      before { post series_decks_url, params: { series_deck: { name: 'test', interfix: 'something' } } }

      it '認可されないこと' do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#update' do
      let!(:series_deck) { create(:series_deck) }

      before { patch series_deck_url(series_deck.id), params: { series_deck: { name: 'updated' } } }

      it '認可されないこと' do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#destroy' do
      let!(:series_deck) { create(:series_deck) }

      before { delete series_deck_url(series_deck.id) }

      it '認可されないこと' do
        expect(response).to have_http_status :forbidden
      end
    end
  end

  describe 'super_admin' do
    let(:series_deck) { create(:series_deck) }

    before do
      user = create(:user, :super_admin)
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    it_behaves_like '全てのアクセスが認可されること'
  end

  describe 'user_admin' do
    let(:series_deck) { create(:series_deck) }

    before do
      user = create(:user, :user_admin)
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    it_behaves_like '全てのアクセスが認可されないこと'
  end

  describe 'playlist_admin' do
    let(:series_deck) { create(:series_deck) }

    before do
      user = create(:user, :playlist_admin)
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    it_behaves_like '全てのアクセスが認可されないこと'
  end

  describe 'deck_admin' do
    let(:series_deck) { create(:series_deck) }

    before do
      user = create(:user, :deck_admin)
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    it_behaves_like '全てのアクセスが認可されること'
  end

  describe 'reader_user' do
    before do
      user = create(:user, :reader_user)
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    describe '#index' do
      before { get series_decks_url }

      it '認可されること' do
        expect(response).to have_http_status :ok
      end
    end

    describe '#show' do
      let!(:series_deck) { create(:series_deck) }

      before { get series_deck_url(series_deck.id) }

      it '認可されること' do
        expect(response).to have_http_status :ok
      end
    end

    describe '#create' do
      before { post series_decks_url, params: { series_deck: { name: 'test', interfix: 'something' } } }

      it '認可されないこと' do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#update' do
      let!(:series_deck) { create(:series_deck) }

      before { patch series_deck_url(series_deck.id), params: { series_deck: { name: 'updated' } } }

      it '認可されないこと' do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#destroy' do
      let!(:series_deck) { create(:series_deck) }

      before { delete series_deck_url(series_deck.id) }

      it '認可されないこと' do
        expect(response).to have_http_status :forbidden
      end
    end
  end
end
