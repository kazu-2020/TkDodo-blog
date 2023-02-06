# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Scim::V2::Users', type: :request do
  # SCIM 仕様 https://www.rfc-editor.org/rfc/rfc7644
  let!(:header) do
    {
      'Content-Type': 'application/scim+json',
      Authorization: "Bearer #{token}"
    }
  end

  shared_examples '認証が効いていること' do
    context '認証を通過できなかった場合' do
      let(:token) { 'hoge' }

      it '認証エラーになること' do
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context '認証を通過できた場合' do
      let(:token) { 'shah7zengieg7Fa3Watah7Aeveida7aiTa4phe3Eu3eegi7meemah4eejohheenguowaeR7uM3Aithi3iexohhohboot3oot3efaiChohphaem3foo7aitoongieV7Cu' }

      it '認証エラーにならないこと' do
        expect(response).not_to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /scim/v2/Users' do
    describe '認証の確認' do
      before do
        get scim_v2_Users_path, params: {}, headers: header
      end

      it_behaves_like '認証が効いていること'
    end

    # https://developer.okta.com/docs/reference/scim/scim-20/#determine-if-the-user-already-exists
    describe 'ユーザーの確認' do
      let!(:token) { 'shah7zengieg7Fa3Watah7Aeveida7aiTa4phe3Eu3eegi7meemah4eejohheenguowaeR7uM3Aithi3iexohhohboot3oot3efaiChohphaem3foo7aitoongieV7Cu' }
      let!(:user) { create(:user, man_number: 'man_number@example.com', email: 'hoge@example.com') }

      before do
        create(:user, man_number: 'dummy_number@example.com', email: 'dummy@example.com', first_name: 'だみー',
               last_name: 'じろう')
        get scim_v2_Users_path, params: params, headers: header
      end

      context 'filterのユーザーが存在する場合' do
        let(:params) do
          {
            filter: 'userName eq "man_number@example.com"'
          }
        end

        it 'ユーザー情報が返却されること' do
          expect(response).to have_http_status(:ok)
          expect(JSON.parse(response.body)).to include(
                                                 { 'schemas' => ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
                                                   'totalResults' => 1,
                                                   'startIndex' => 1,
                                                   'itemsPerPage' => 100,
                                                   'Resources' =>
                                                     [{ 'id' => user.id.to_s,
                                                        'userName' => 'man_number@example.com',
                                                        'emails' => [{ 'primary' => true, 'value' => 'hoge@example.com' }],
                                                        'name' => { 'givenName' => user.last_name, 'familyName' => user.first_name },
                                                        'meta' =>
                                                          { 'resourceType' => 'User',
                                                            'created' => user.created_at.strftime('%Y-%m-%dT%H:%M:%S%:z'),
                                                            'lastModified' => user.updated_at.strftime('%Y-%m-%dT%H:%M:%S%:z'),
                                                            'location' => "http://www.example.com/scim/v2/Users/#{user.id}" },
                                                        'schemas' => ['urn:ietf:params:scim:schemas:core:2.0:User'] }] }
                                               )
        end
      end

      context 'filterのユーザーが存在しない場合' do
        let(:params) do
          {
            filter: 'userName eq "empty@example.com"'
          }
        end

        it 'ユーザー情報が空で返却されること' do
          expect(response).to have_http_status(:ok)
          expect(JSON.parse(response.body)).to include(
                                                 {
                                                   'schemas' => [
                                                     'urn:ietf:params:scim:api:messages:2.0:ListResponse'
                                                   ],
                                                   'totalResults' => 0,
                                                   'startIndex' => 1,
                                                   'itemsPerPage' => 100,
                                                   'Resources' => []
                                                 }
                                               )
        end
      end
    end
  end

  describe 'GET /scim/v2/Users/:id' do
    let!(:user) { create(:user, man_number: 'man_number@example.com', email: 'hoge@example.com') }
    describe '認証の確認' do
      before do
        get scim_v2_path(user), headers: header
      end

      it_behaves_like '認証が効いていること'
    end

    describe 'ユーザーの確認' do
      let!(:token) { 'shah7zengieg7Fa3Watah7Aeveida7aiTa4phe3Eu3eegi7meemah4eejohheenguowaeR7uM3Aithi3iexohhohboot3oot3efaiChohphaem3foo7aitoongieV7Cu' }

      before do
        get scim_v2_path(user), headers: header
      end

      it 'ユーザー情報が返却されること' do
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)).to include(
                                               { 'id' => user.id.to_s,
                                                 'userName' => 'man_number@example.com',
                                                 'emails' => [{ 'primary' => true, 'value' => 'hoge@example.com' }],
                                                 'name' => { 'givenName' => user.last_name, 'familyName' => user.first_name },
                                                 'meta' =>
                                                   { 'resourceType' => 'User',
                                                     'created' => user.created_at.strftime('%Y-%m-%dT%H:%M:%S%:z'),
                                                     'lastModified' => user.updated_at.strftime('%Y-%m-%dT%H:%M:%S%:z'),
                                                     'location' => "http://www.example.com/scim/v2/Users/#{user.id}" },
                                                 'schemas' => ['urn:ietf:params:scim:schemas:core:2.0:User'] }
                                             )
      end
    end
  end

  describe 'POST /scim/v2/Users' do
    describe '認証の確認' do
      before do
        post scim_v2_Users_path, params: {}, headers: header
      end

      it_behaves_like '認証が効いていること'
    end

    describe 'ユーザーの作成処理' do
      let!(:token) { 'shah7zengieg7Fa3Watah7Aeveida7aiTa4phe3Eu3eegi7meemah4eejohheenguowaeR7uM3Aithi3iexohhohboot3oot3efaiChohphaem3foo7aitoongieV7Cu' }

      context 'リクエストと同じemailを持つユーザーが存在しない場合' do
        let(:params) do
          {
            'schemas' => ['urn:ietf:params:scim:schemas:core:2.0:User'],
            'userName' => 'man_number@example.com',
            'name' => { 'givenName' => 'test', 'familyName' => 'tarou' },
            'emails' => [{ 'primary' => true, 'value' => 'hoge@example.com', 'type' => 'work' }],
            'displayName' => 'test tarou',
            'locale' => 'en-US',
            'externalId' => '00u3dm1s4cn85iULC697',
            'groups' => [],
            'password' => '[FILTERED]', 'active' => true
          }.to_json
        end

        it 'ユーザーが作成されること' do
          expect do
            post scim_v2_Users_path, params: params, headers: header
          end.to change { User.count }.by(1)

          expect(response).to have_http_status(:created)
          user = User.last
          expect(user.man_number).to eq 'man_number@example.com'
          expect(user.email).to eq 'hoge@example.com'
          expect(user.last_name).to eq 'test'
          expect(user.first_name).to eq 'tarou'
          expect(JSON.parse(response.body)).to include(
                                                 { 'userName' => 'man_number@example.com',
                                                   'name' => { 'givenName' => 'test', 'familyName' => 'tarou' },
                                                   'meta' =>
                                                     { 'resourceType' => 'User',
                                                       'created' => user.created_at.strftime('%Y-%m-%dT%H:%M:%S%:z'),
                                                       'lastModified' => user.updated_at.strftime('%Y-%m-%dT%H:%M:%S%:z'),
                                                       'location' => "http://www.example.com/scim/v2/Users/#{user.id}" },
                                                   'id' => user.id.to_s,
                                                   'schemas' => ['urn:ietf:params:scim:schemas:core:2.0:User'] }
                                               )
        end
      end

      context 'リクエストと同じemailを持つユーザーが存在する場合' do
        let(:params) do
          {
            'schemas' => ['urn:ietf:params:scim:schemas:core:2.0:User'],
            'userName' => 'man_number@example.com',
            'name' => { 'givenName' => 'test', 'familyName' => 'tarou' },
            'emails' => [{ 'primary' => true, 'value' => 'hoge@example.com', 'type' => 'work' }],
            'displayName' => 'test tarou',
            'locale' => 'en-US',
            'externalId' => '00u3dm1s4cn85iULC697',
            'groups' => [],
            'password' => '[FILTERED]', 'active' => true
          }.to_json
        end
        let!(:user) do
          create(:user, man_number: 'man_number@example.com', email: 'hoge@example.com', first_name: 'hoge',
                 last_name: 'fuga')
        end

        it 'ユーザーが更新されること' do
          expect do
            post scim_v2_Users_path, params: params, headers: header
          end.not_to change { User.count }

          expect(response).to have_http_status(:created)
          user.reload
          expect(user.man_number).to eq 'man_number@example.com'
          expect(user.email).to eq 'hoge@example.com'
          expect(user.last_name).to eq 'test'
          expect(user.first_name).to eq 'tarou'
          expect(JSON.parse(response.body)).to include(
                                                 { 'userName' => 'man_number@example.com',
                                                   'name' => { 'givenName' => 'test', 'familyName' => 'tarou' },
                                                   'meta' =>
                                                     { 'resourceType' => 'User',
                                                       'created' => user.created_at.strftime('%Y-%m-%dT%H:%M:%S%:z'),
                                                       'lastModified' => user.updated_at.strftime('%Y-%m-%dT%H:%M:%S%:z'),
                                                       'location' => "http://www.example.com/scim/v2/Users/#{user.id}" },
                                                   'id' => user.id.to_s,
                                                   'schemas' => ['urn:ietf:params:scim:schemas:core:2.0:User'] }
                                               )
        end
      end
    end
  end

  describe 'PUT /scim/v2/Users/:id' do
    let!(:user) { create(:user, email: 'hoge@example.com', first_name: 'aaa', last_name: 'bbb') }

    describe '認証の確認' do
      before do
        put scim_v2_path(user), params: {}, headers: header
      end

      it_behaves_like '認証が効いていること'
    end

    describe 'ユーザーの更新処理' do
      let!(:token) { 'shah7zengieg7Fa3Watah7Aeveida7aiTa4phe3Eu3eegi7meemah4eejohheenguowaeR7uM3Aithi3iexohhohboot3oot3efaiChohphaem3foo7aitoongieV7Cu' }
      let!(:params) do
        {
          'id' => user.id.to_s,
          'userName' => 'man_number@example.com',
          'name' => { 'familyName' => 'tarou', 'givenName' => 'test' },
          'meta' => {
            'location' => "https://localhost:5500/scim/v2/Users/#{user.id}",
            'created' => '2022-11-28T12:04:31+09:00',
            'lastModified' => '2022-11-28T12:04:31+09:00', '
            resourceType' => 'User'
          },
          'schemas' => ['urn:ietf:params:scim:schemas:core:2.0:User'],
          'emails' => [{ 'primary' => true, 'value' => 'hoge@example.com', 'type' => 'work' }],
          'displayName' => 'test tarou', 'locale' => 'en-US', 'externalId' => '00u3dm1s4cn85iULC697', 'groups' => []
        }.to_json
      end

      it 'ユーザーが更新されること' do
        expect do
          put scim_v2_path(user), params: params, headers: header
        end.not_to change { User.count }

        expect(response).to have_http_status(:ok)
        user.reload
        expect(user.man_number).to eq 'man_number@example.com'
        expect(user.email).to eq 'hoge@example.com'
        expect(user.last_name).to eq 'test'
        expect(user.first_name).to eq 'tarou'
        expect(JSON.parse(response.body)).to include(
                                               { 'userName' => 'man_number@example.com',
                                                 'name' => { 'givenName' => 'test', 'familyName' => 'tarou' },
                                                 'meta' =>
                                                   { 'resourceType' => 'User',
                                                     'created' => user.created_at.strftime('%Y-%m-%dT%H:%M:%S%:z'),
                                                     'lastModified' => user.updated_at.strftime('%Y-%m-%dT%H:%M:%S%:z'),
                                                     'location' => "http://www.example.com/scim/v2/Users/#{user.id}" },
                                                 'id' => user.id.to_s,
                                                 'schemas' => ['urn:ietf:params:scim:schemas:core:2.0:User'] }
                                             )
      end
    end

    describe 'ユーザーの削除処理' do
      let!(:token) { 'shah7zengieg7Fa3Watah7Aeveida7aiTa4phe3Eu3eegi7meemah4eejohheenguowaeR7uM3Aithi3iexohhohboot3oot3efaiChohphaem3foo7aitoongieV7Cu' }
      let!(:params) do
        { 'id' => user.id.to_s,
          'userName' => 'man_number@example.com',
          'name' => { 'familyName' => 'tarou', 'givenName' => 'test' },
          'meta' => {
            'location' => "https://localhost:5500/scim/v2/Users/#{user.id}",
            'created' => '2022-11-28T12:04:31+09:00',
            'lastModified' => '2022-11-28T12:04:31+09:00', '
            resourceType' => 'User'
          },
          'schemas' => ['urn:ietf:params:scim:schemas:core:2.0:User'],
          'emails' => [{ 'primary' => true, 'value' => 'hoge@example.com', 'type' => 'work' }],
          'displayName' => 'test tarou', 'locale' => 'en-US', 'externalId' => '00u3dm1s4cn85iULC697', 'groups' => [],
          'active' => active }.to_json
      end

      context 'active フラグが false のとき' do
        let(:active) { false }

        it 'ユーザーが削除されること' do
          expect do
            put scim_v2_path(user), params: params, headers: header
          end.to change { User.count }.by(-1)

          expect(response).to have_http_status(:ok)
          expect(User.find_by_id(user.id)).to be_nil

          expect(JSON.parse(response.body)).to include(
                                                 { 'userName' => nil,
                                                   'name' => { 'givenName' => 'bbb', 'familyName' => 'aaa' },
                                                   'emails' => [{ 'primary' => true, 'value' => 'hoge@example.com' }],
                                                   'meta' =>
                                                     { 'resourceType' => 'User',
                                                       'created' => user.created_at.strftime('%Y-%m-%dT%H:%M:%S%:z'),
                                                       'lastModified' => user.updated_at.strftime('%Y-%m-%dT%H:%M:%S%:z'),
                                                       'location' => "http://www.example.com/scim/v2/Users/#{user.id}" },
                                                   'id' => user.id.to_s,
                                                   'schemas' => ['urn:ietf:params:scim:schemas:core:2.0:User'] }
                                               )
        end
      end

      context 'active フラグが true のとき' do
        let(:active) { true }

        it 'ユーザーが削除されないこと' do
          expect do
            put scim_v2_path(user), params: params, headers: header
          end.not_to change { User.count }

          expect(response).to have_http_status(:ok)
          user.reload
          expect(user.man_number).to eq 'man_number@example.com'
          expect(user.email).to eq 'hoge@example.com'
          expect(user.last_name).to eq 'test'
          expect(user.first_name).to eq 'tarou'

          expect(JSON.parse(response.body)).to include(
                                                 { 'userName' => 'man_number@example.com',
                                                   'name' => { 'givenName' => 'test', 'familyName' => 'tarou' },
                                                   'emails' => [{ 'primary' => true, 'value' => 'hoge@example.com' }],
                                                   'meta' =>
                                                     { 'resourceType' => 'User',
                                                       'created' => user.created_at.strftime('%Y-%m-%dT%H:%M:%S%:z'),
                                                       'lastModified' => user.updated_at.strftime('%Y-%m-%dT%H:%M:%S%:z'),
                                                       'location' => "http://www.example.com/scim/v2/Users/#{user.id}" },
                                                   'id' => user.id.to_s,
                                                   'schemas' => ['urn:ietf:params:scim:schemas:core:2.0:User'] }
                                               )
        end
      end

      context 'active フラグがパラメータに存在しない時' do
        # ユーザーの更新処理 でテスト済みのためスキップ
      end
    end
  end
end
