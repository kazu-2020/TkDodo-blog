# frozen_string_literal: true

describe EditorsController, type: :request do
  describe 'GET #fetch_link' do
    let(:valid_url) { 'https://nhk.jp' }
    let(:invalid_url) { "https://example#{SecureRandom.uuid}.com" }

    context '有効なURLが渡されたとき' do
      it 'リクエストが成功すること' do
        get 'editor/fetch_link', { url: valid_url }
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)['success']).to eq 1
      end
    end

    context '無効なURLが渡されたとき' do
      it 'リクエストは成功するが、レスポンスにエラーが含まれる' do
        get 'editor/fetch_link', { url: invalid_url }
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)['success']).to eq 0
      end
    end
  end
end
