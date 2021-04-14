# frozen_string_literal: true

describe OembedController, type: :request, skip: 'API依存のspec responseをmockする' do
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

  describe 'Howto url' do
    it 'returns success response' do
      get '/oembed', url: 'https://www.nhk.jp/p/gc/ts/E5Q48579J3/howto/49'
      expect(response.status).to eq 200
    end
  end

  describe 'Event url' do
    it 'returns success response' do
      get '/oembed', url: 'https://www.nhk.jp/p/gc/ts/D4VPQVK78M/event/94'
      expect(response.status).to eq 200
    end
  end

  describe 'Faqpage url' do
    it 'returns success response' do
      get '/oembed', url: 'https://www.nhk.jp/p/gc/ts/E5Q48579J3/faqpage/49'
      expect(response.status).to eq 200
    end
  end
end
