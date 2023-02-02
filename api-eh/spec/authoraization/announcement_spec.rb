# frozen_string_literal: true

require 'rails_helper'

describe 'Announcement', type: :request do
  describe 'system roles' do
    shared_examples '全てのアクセスが認可されること' do
      it 'index' do
        get announcements_path
        expect(response).to have_http_status :ok
      end

      it 'create' do
        post announcements_path, params: { announcement: attributes_for(:announcement) }
        expect(response).to have_http_status :ok
      end

      it 'show' do
        announcement = create(:announcement)
        get announcement_path(announcement)
        expect(response).to have_http_status :ok
      end

      it 'update' do
        announcement = create(:announcement)
        patch announcement_path(announcement), params: { announcement: attributes_for(:announcement) }
        expect(response).to have_http_status :ok
      end

      it 'destroy' do
        announcement = create(:announcement)
        delete announcement_path(announcement)
        expect(response).to have_http_status :ok
      end
    end

    context 'super_admin' do
      before do
        user = create(:user, :super_admin)
        allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
        allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
      end

      it_behaves_like '全てのアクセスが認可されること'
    end

    context 'user_admin' do
      before do
        user = create(:user, :user_admin)
        allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
        allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
      end

      it_behaves_like '全てのアクセスが認可されること'
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

      it_behaves_like '全てのアクセスが認可されること'
    end

    context 'reader_user' do
      before do
        user = create(:user, :reader_user)
        allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
        allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
      end

      it 'index' do
        get announcements_path
        expect(response).to have_http_status :ok
      end

      it 'create' do
        post announcements_path, params: { announcement: attributes_for(:announcement) }
        expect(response).to have_http_status :forbidden
      end

      it 'show' do
        announcement = create(:announcement)
        get announcement_path(announcement)
        expect(response).to have_http_status :ok
      end

      it 'update' do
        announcement = create(:announcement)
        patch announcement_path(announcement), params: { announcement: attributes_for(:announcement) }
        expect(response).to have_http_status :forbidden
      end

      it 'destroy' do
        announcement = create(:announcement)
        delete announcement_path(announcement)
        expect(response).to have_http_status :forbidden
      end
    end

    context '権限なし' do
      before do
        user = create(:user, :super_admin)
        user.remove_role :super_admin
        allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
        allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
      end

      it 'index' do
        get announcements_path
        expect(response).to have_http_status :ok
      end

      it 'create' do
        post announcements_path, params: { announcement: attributes_for(:announcement) }
        expect(response).to have_http_status :forbidden
      end

      it 'show' do
        announcement = create(:announcement)
        get announcement_path(announcement)
        expect(response).to have_http_status :ok
      end

      it 'update' do
        announcement = create(:announcement)
        patch announcement_path(announcement), params: { announcement: attributes_for(:announcement) }
        expect(response).to have_http_status :forbidden
      end

      it 'destroy' do
        announcement = create(:announcement)
        delete announcement_path(announcement)
        expect(response).to have_http_status :forbidden
      end
    end
  end
end
