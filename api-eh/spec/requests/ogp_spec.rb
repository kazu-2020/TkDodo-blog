# frozen_string_literal: true

require 'rails_helper'

describe OgpController, type: :request do
  describe 'GET /ogp' do
    before { create(:playlist) }

    it 'returns success response' do
      get ogp_url, params: { url: 'https://www.nhk.or.jp/' }

      expect(response.status).to eq 200
    end
  end
end
