# frozen_string_literal: true

require 'rails_helper'

describe EditorsController, type: :request do
  describe 'GET #fetch_link' do
    let(:valid_url) { 'https://nhk.jp' }
    let(:invalid_url) { "https://example#{SecureRandom.uuid}.com" }

    context '有効なURLが渡されたとき' do
      it 'リクエストが成功すること' do
        get fetch_link_editor_path(url: valid_url)
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)['success']).to eq true
      end
    end

    context '無効なURLが渡されたとき' do
      it 'リクエストは成功するが、レスポンスにエラーが含まれる' do
        get fetch_link_editor_path(url: invalid_url)
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)['success']).to eq false
      end
    end
  end
end
