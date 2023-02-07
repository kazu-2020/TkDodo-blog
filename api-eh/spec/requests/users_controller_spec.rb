# frozen_string_literal: true

# frozen_string_literal: true

require 'rails_helper'

describe 'UsersController' do
  before do
    create_list(:user, 60)
  end

  describe 'GET #index' do
    context '検索フォームに値が入力されていない場合' do
      it '50件取得できること' do
        get users_url
        body = JSON.parse(response.body)
        expect(body['users'].length).to eq 50
        expect(response).to have_http_status :ok
      end
    end

    context '検索フォームに値が入力されている場合' do
      context '検索条件に合致するユーザーが存在する場合' do
        before do
          create(:user, first_name: 'John', last_name: 'Doe', email: 'hoge@example.test.com')
          create(:user, first_name: 'Jane', last_name: 'Doe', email: 'fuga@example.test.com')
          create(:user, first_name: 'Cris', last_name: 'Doe', email: 'piyo@example.test.com')
        end

        it '名前が部分一致するユーザーのデータを取得できること' do
          get users_url, params: { keyword: 'Doe' }
          body = JSON.parse(response.body)
          expect(body['users'].length).to eq 3
          expect(body['users'][0]['firstName']).to eq 'Cris'
          expect(body['users'][1]['firstName']).to eq 'Jane'
          expect(body['users'][2]['firstName']).to eq 'John'
          expect(response).to have_http_status :ok
        end

        it 'メールアドレスが部分一致するユーザーのデータを取得できること' do
          get users_url, params: { keyword: 'test' }
          body = JSON.parse(response.body)
          expect(body['users'].length).to eq 3
          expect(body['users'][0]['email']).to include 'test'
          expect(body['users'][1]['email']).to include 'test'
          expect(body['users'][2]['email']).to include 'test'
          expect(response).to have_http_status :ok
        end
      end

      context '検索条件に合致するユーザーが存在しない場合' do
        it '空の配列が返されること' do
          get users_url, params: { keyword: 'test' }
          body = JSON.parse(response.body)
          expect(body['users'].length).to eq 0
          expect(response).to have_http_status :ok
        end
      end
    end
  end
end
