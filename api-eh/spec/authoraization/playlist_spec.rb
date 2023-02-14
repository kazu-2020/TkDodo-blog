# frozen_string_literal: true

require 'rails_helper'

describe 'Playlist', type: :request do
  shared_examples '全てのアクセスが認可されること' do
    describe '#index' do
      before { get playlists_url }

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#show' do
      before { get playlist_url(playlist) }

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#create' do
      let(:image_data_encoded_to_base64) {
        "data:image/png;base64,#{Base64.strict_encode64(File.read(Rails.root.join('spec', 'fixtures', 'images',
                                                                                  'min_test.png').to_s))}"
      }
      let(:logo_image) { image_data_encoded_to_base64 }
      let(:eyecatch_image) { image_data_encoded_to_base64 }
      let(:hero_image) { image_data_encoded_to_base64 }
      let(:params) {
        { playlist: { name: 'cool name', logo_image: logo_image, eyecatch_image: eyecatch_image,
                      hero_image: hero_image } }
      }

      before { post playlists_url, params: params }

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#delete' do
      before { delete playlist_url(playlist) }

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#upload_article_image_by_url' do
      let(:params) { { url: 'https://placehold.jp/150x150.png' } }

      before { post '/playlists/undefined/upload_article_image_by_url', params: params }

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#upload_article_image_by_file' do
      let(:image) do
        fixture_file_upload(Rails.root.join('spec/fixtures/images/square.png'), 'image/png')
      end

      before do
        allow_any_instance_of(PlaylistsController).to receive(:image_param).and_return(image)
        post '/playlists/undefined/upload_article_image_by_file'
      end

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#actors_and_contributors' do
      before { get actors_and_contributors_playlist_url(playlist) }

      it do
        expect(response).to have_http_status :ok
      end
    end

    describe '#bundle_items' do
      before { get bundle_items_playlist_url(playlist) }

      it do
        expect(response).to have_http_status :ok
      end
    end
  end

  shared_examples '全てのアクセスが認可されないこと' do
    describe '#index' do
      before { get playlists_url }

      it do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#show' do
      before { get playlist_url(playlist) }

      it do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#create' do
      let(:image_data_encoded_to_base64) {
        "data:image/png;base64,#{Base64.strict_encode64(File.read(Rails.root.join('spec', 'fixtures', 'images',
                                                                                  'min_test.png').to_s))}"
      }
      let(:logo_image) { image_data_encoded_to_base64 }
      let(:eyecatch_image) { image_data_encoded_to_base64 }
      let(:hero_image) { image_data_encoded_to_base64 }
      let(:params) {
        { playlist: { name: 'cool name', logo_image: logo_image, eyecatch_image: eyecatch_image,
                      hero_image: hero_image } }
      }

      before { post playlists_url, params: params }

      it do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#delete' do
      before { delete playlist_url(playlist) }

      it do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#upload_article_image_by_url' do
      let(:params) { { url: 'https://placehold.jp/150x150.png' } }

      before { post '/playlists/undefined/upload_article_image_by_url', params: params }

      it do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#upload_article_image_by_file' do
      let(:image) do
        fixture_file_upload(Rails.root.join('spec/fixtures/images/square.png'), 'image/png')
      end

      before do
        allow_any_instance_of(PlaylistsController).to receive(:image_param).and_return(image)

        post '/playlists/undefined/upload_article_image_by_file'
      end

      it do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#actors_and_contributors' do
      before { get actors_and_contributors_playlist_url(playlist) }

      it do
        expect(response).to have_http_status :forbidden
      end
    end

    describe '#bundle_items' do
      before { get bundle_items_playlist_url(playlist) }

      it do
        expect(response).to have_http_status :forbidden
      end
    end
  end

  before do
    poc_client = instance_double(PocApiClient)
    allow(PocApiClient).to receive(:new).and_return(poc_client)
    allow(poc_client).to receive(:playlist_ll_bundle).with(playlist_id: anything).and_return({})
  end

  describe 'system roles' do
    let(:playlist) { create(:playlist) }

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
        before { get playlists_url }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#show' do
        before { get playlist_url(playlist) }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#create' do
        let(:image_data_encoded_to_base64) {
          "data:image/png;base64,#{Base64.strict_encode64(File.read(Rails.root.join('spec', 'fixtures', 'images',
                                                                                    'min_test.png').to_s))}"
        }
        let(:logo_image) { image_data_encoded_to_base64 }
        let(:eyecatch_image) { image_data_encoded_to_base64 }
        let(:hero_image) { image_data_encoded_to_base64 }
        let(:params) {
          { playlist: { name: 'cool name', logo_image: logo_image, eyecatch_image: eyecatch_image,
                        hero_image: hero_image } }
        }

        before { post playlists_url, params: params }

        it do
          expect(response).to have_http_status :forbidden
        end
      end

      describe '#delete' do
        before { delete playlist_url(playlist) }

        it do
          expect(response).to have_http_status :forbidden
        end
      end

      describe '#upload_article_image_by_url' do
        let(:params) { { url: 'https://placehold.jp/150x150.png' } }

        before { post '/playlists/undefined/upload_article_image_by_url', params: params }

        it do
          expect(response).to have_http_status :forbidden
        end
      end

      describe '#upload_article_image_by_file' do
        let(:image) do
          fixture_file_upload(Rails.root.join('spec/fixtures/images/square.png'), 'image/png')
        end

        before do
          allow_any_instance_of(PlaylistsController).to receive(:image_param).and_return(image)

          post '/playlists/undefined/upload_article_image_by_file'
        end

        it do
          expect(response).to have_http_status :forbidden
        end
      end

      describe '#actors_and_contributors' do
        before { get actors_and_contributors_playlist_url(playlist) }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#bundle_items' do
        before { get bundle_items_playlist_url(playlist) }

        it do
          expect(response).to have_http_status :ok
        end
      end
    end
  end

  describe 'recommend_playlist roles' do
    let(:playlist) { create(:playlist) }
    let(:user) { create(:user, :user_admin) } # ユーザー管理者はプレイリストに関する権限を持たない

    before do
      allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
      allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
    end

    context '代表承認者' do
      before { user.add_role(:manager, playlist) }

      describe '#index' do
        before { get playlists_url }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#show' do
        before { get playlist_url(playlist) }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#create' do
        let(:image_data_encoded_to_base64) {
          "data:image/png;base64,#{Base64.strict_encode64(File.read(Rails.root.join('spec', 'fixtures', 'images',
                                                                                    'min_test.png').to_s))}"
        }
        let(:logo_image) { image_data_encoded_to_base64 }
        let(:eyecatch_image) { image_data_encoded_to_base64 }
        let(:hero_image) { image_data_encoded_to_base64 }
        let(:params) {
          { playlist: { name: 'cool name', logo_image: logo_image, eyecatch_image: eyecatch_image,
                        hero_image: hero_image } }
        }

        before { post playlists_url, params: params }

        it do
          expect(response).to have_http_status :forbidden
        end
      end

      describe '#delete' do
        before { delete playlist_url(playlist) }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#upload_article_image_by_url' do
        let(:params) { { url: 'https://placehold.jp/150x150.png' } }

        before { post '/playlists/undefined/upload_article_image_by_url', params: params }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#upload_article_image_by_file' do
        let(:image) do
          fixture_file_upload(Rails.root.join('spec/fixtures/images/square.png'), 'image/png')
        end

        before do
          allow_any_instance_of(PlaylistsController).to receive(:image_param).and_return(image)
          post '/playlists/undefined/upload_article_image_by_file'
        end

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#actors_and_contributors' do
        before { get actors_and_contributors_playlist_url(playlist) }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#bundle_items' do
        before { get bundle_items_playlist_url(playlist) }

        it do
          expect(response).to have_http_status :ok
        end
      end
    end

    context '承認者' do
      before { user.add_role(:approver, playlist) }

      describe '#index' do
        before { get playlists_url }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#show' do
        before { get playlist_url(playlist) }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#create' do
        let(:image_data_encoded_to_base64) {
          "data:image/png;base64,#{Base64.strict_encode64(File.read(Rails.root.join('spec', 'fixtures', 'images',
                                                                                    'min_test.png').to_s))}"
        }
        let(:logo_image) { image_data_encoded_to_base64 }
        let(:eyecatch_image) { image_data_encoded_to_base64 }
        let(:hero_image) { image_data_encoded_to_base64 }
        let(:params) {
          { playlist: { name: 'cool name', logo_image: logo_image, eyecatch_image: eyecatch_image,
                        hero_image: hero_image } }
        }

        before { post playlists_url, params: params }

        it do
          expect(response).to have_http_status :forbidden
        end
      end

      describe '#delete' do
        before { delete playlist_url(playlist) }

        it do
          expect(response).to have_http_status :forbidden
        end
      end

      describe '#upload_article_image_by_url' do
        let(:params) { { url: 'https://placehold.jp/150x150.png' } }

        before { post '/playlists/undefined/upload_article_image_by_url', params: params }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#upload_article_image_by_file' do
        let(:image) do
          fixture_file_upload(Rails.root.join('spec/fixtures/images/square.png'), 'image/png')
        end

        before do
          allow_any_instance_of(PlaylistsController).to receive(:image_param).and_return(image)
          post '/playlists/undefined/upload_article_image_by_file'
        end

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#actors_and_contributors' do
        before { get actors_and_contributors_playlist_url(playlist) }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#bundle_items' do
        before { get bundle_items_playlist_url(playlist) }

        it do
          expect(response).to have_http_status :ok
        end
      end
    end

    context '入力者' do
      before { user.add_role(:editor, playlist) }

      describe '#index' do
        before { get playlists_url }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#show' do
        before { get playlist_url(playlist) }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#create' do
        let(:image_data_encoded_to_base64) {
          "data:image/png;base64,#{Base64.strict_encode64(File.read(Rails.root.join('spec', 'fixtures', 'images',
                                                                                    'min_test.png').to_s))}"
        }
        let(:logo_image) { image_data_encoded_to_base64 }
        let(:eyecatch_image) { image_data_encoded_to_base64 }
        let(:hero_image) { image_data_encoded_to_base64 }
        let(:params) {
          { playlist: { name: 'cool name', logo_image: logo_image, eyecatch_image: eyecatch_image,
                        hero_image: hero_image } }
        }

        before { post playlists_url, params: params }

        it do
          expect(response).to have_http_status :forbidden
        end
      end

      describe '#delete' do
        before { delete playlist_url(playlist) }

        it do
          expect(response).to have_http_status :forbidden
        end
      end

      describe '#upload_article_image_by_url' do
        let(:params) { { url: 'https://placehold.jp/150x150.png' } }

        before { post '/playlists/undefined/upload_article_image_by_url', params: params }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#upload_article_image_by_file' do
        let(:image) do
          fixture_file_upload(Rails.root.join('spec/fixtures/images/square.png'), 'image/png')
        end

        before do
          allow_any_instance_of(PlaylistsController).to receive(:image_param).and_return(image)
          post '/playlists/undefined/upload_article_image_by_file'
        end

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#actors_and_contributors' do
        before { get actors_and_contributors_playlist_url(playlist) }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#bundle_items' do
        before { get bundle_items_playlist_url(playlist) }

        it do
          expect(response).to have_http_status :ok
        end
      end
    end

    context '閲覧者' do
      before { user.add_role(:reader, playlist) }

      describe '#index' do
        before { get playlists_url }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#show' do
        before { get playlist_url(playlist) }

        it do
          expect(response).to have_http_status :ok
        end
      end

      describe '#create' do
        let(:image_data_encoded_to_base64) {
          "data:image/png;base64,#{Base64.strict_encode64(File.read(Rails.root.join('spec', 'fixtures', 'images',
                                                                                    'min_test.png').to_s))}"
        }
        let(:logo_image) { image_data_encoded_to_base64 }
        let(:eyecatch_image) { image_data_encoded_to_base64 }
        let(:hero_image) { image_data_encoded_to_base64 }
        let(:params) {
          { playlist: { name: 'cool name', logo_image: logo_image, eyecatch_image: eyecatch_image,
                        hero_image: hero_image } }
        }

        before { post playlists_url, params: params }

        it do
          expect(response).to have_http_status :forbidden
        end
      end

      describe '#delete' do
        before { delete playlist_url(playlist) }

        it do
          expect(response).to have_http_status :forbidden
        end
      end

      describe '#upload_article_image_by_url' do
        let(:params) { { url: 'https://placehold.jp/150x150.png' } }

        before { post '/playlists/undefined/upload_article_image_by_url', params: params }

        it do
          expect(response).to have_http_status :forbidden
        end
      end

      describe '#upload_article_image_by_file' do
        let(:image) do
          fixture_file_upload(Rails.root.join('spec/fixtures/images/square.png'), 'image/png')
        end

        before do
          allow_any_instance_of(PlaylistsController).to receive(:image_param).and_return(image)

          post '/playlists/undefined/upload_article_image_by_file'
        end

        it do
          expect(response).to have_http_status :forbidden
        end
      end

      describe '#bundle_items' do
        before { get bundle_items_playlist_url(playlist) }

        it do
          expect(response).to have_http_status :ok
        end
      end
    end
  end
end
