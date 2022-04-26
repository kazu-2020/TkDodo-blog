# frozen_string_literal: true

require 'rails_helper'

describe RichlinkController, type: :request do
  describe 'GET /richlink' do
    let!(:playlist) { create(:playlist) }

    context 'NHK公式ホームページからアクセスした場合' do
      it 'レスポンスが正常に返ってくること' do
        get richlink_url, params: { url: 'https://www.nhk.or.jp/' }

        expect(response.status).to eq 200
        expect(response.body).not_to include 'Error'
      end
    end

    context 'dev環境からアクセスした場合' do
      it 'レスポンスが正常に返ってくること' do
        playlist_id = format('%010<number>d', number: playlist.id)
        get richlink_url, params: { url: "https://dev-www-eh.nr.nhk.jp/p/pl/recommend-tep-#{playlist_id}" }

        expect(response.status).to eq 200
        expect(response.body).not_to include 'Error'
      end
    end
  end
end
