# frozen_string_literal: true

require 'rails_helper'

describe RichlinkController, type: :request do
  describe 'GET /richlink' do
    let!(:playlist) { create(:playlist) }

    it 'returns success response' do
      get richlink_url, params: { url: 'https://www.nhk.or.jp/' }

      expect(response.status).to eq 200
      expect(response.body).to_not include 'Error'
    end

    it 'returns success response' do
      playlist_id = format('%010<number>d', number: playlist.id)
      get richlink_url, params: { url: "https://psychic-eureka-90cdb0a4.pages.github.io/p/pl/eh-#{playlist_id}" }

      expect(response.status).to eq 200
      expect(response.body).to_not include 'Error'
    end
  end
end
