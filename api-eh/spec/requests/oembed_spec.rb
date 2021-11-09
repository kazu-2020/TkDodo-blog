# frozen_string_literal: true

require 'rails_helper'

describe OembedController, type: :request do
  describe 'Series url' do
    let(:series_id) { 'R71NJ4MV53' }

    it 'returns success response' do
      VCR.use_cassette('dlab_api_series') do
        get oembed_path, params: { url: "https://www.nhk.jp/p/mitsuhide-smapho/ts/#{series_id}" }
        expect(response.status).to eq 200
      end
    end
  end

  describe 'Playlist url' do
    let(:playlist) { create(:playlist) }

    it 'returns success response' do
      playlist_id = format('%010<number>d', number: playlist.id)
      get oembed_path, params: { url: "https://dev-www-eh.nr.nhk.jp/p/pl/eh-#{playlist_id}" }
      expect(response.status).to eq 200
    end
  end

  describe 'Playlist(Series) url' do
    let(:series_id) { 'R71NJ4MV53' }

    it 'returns success response' do
      VCR.use_cassette('dlab_api_series') do
        get oembed_path, params: { url: "https://dev-www-eh.nr.nhk.jp/p/pl/ts-#{series_id}" }
        expect(response.status).to eq 200
      end
    end
  end

  describe 'Episode url' do
    it 'returns success response' do
      get oembed_path, params: { url: 'https://www.nhk.jp/p/mitsuhide-smapho/ts/R71NJ4MV53/episode/te/B7ZJX92J2N/' }
      expect(response.status).to eq 200
    end
  end

  describe 'Howto url' do
    it 'returns success response' do
      VCR.use_cassette('dlab_api_howto') do
        get oembed_path, params: { url: 'https://www.nhk.jp/p/gc/ts/E5Q48579J3/howto/49' }
        expect(response.status).to eq 200
      end
    end
  end

  describe 'Event url' do
    it 'returns success response' do
      VCR.use_cassette('dlab_api_event') do
        get oembed_path, params: { url: 'https://www.nhk.jp/p/gc/ts/D4VPQVK78M/event/94' }
        expect(response.status).to eq 200
      end
    end
  end

  describe 'Faqpage url' do
    it 'returns success response' do
      VCR.use_cassette('dlab_api_faqpage') do
        get oembed_path, params: { url: 'https://www.nhk.jp/p/gc/ts/E5Q48579J3/faqpage/49' }
        expect(response.status).to eq 200
      end
    end
  end
end
