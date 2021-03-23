# frozen_string_literal: true

describe OembedController, type: :request do
  describe 'Episode url' do
    it 'returns success response' do
      get '/oembed', url: 'https://www.nhk.jp/p/mitsuhide-smapho/ts/R71NJ4MV53/episode/te/B7ZJX92J2N/'
      expect(response.status).to eq 200
    end
  end

  describe 'Series url' do
    it 'returns success response' do
      get '/oembed', url: 'https://www.nhk.jp/p/mitsuhide-smapho/ts/R71NJ4MV53'
      expect(response.status).to eq 200
    end
  end
end
