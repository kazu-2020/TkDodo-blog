# frozen_string_literal: true

require 'rails_helper'

describe DecksController, type: :request do
  describe 'GET #index' do
    context '有効なURLが渡された時' do
      it 'リクエストが成功すること' do
        get decks_url
        expect(response.status).to eq 200
      end
    end
  end
end
