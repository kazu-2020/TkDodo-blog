# frozen_string_literal: true

describe OembedController, type: :request do
  it 'returns success response' do
    get '/oembed', url: 'https://www.nhk.jp/p/mitsuhide-smapho/ts/R71NJ4MV53/episode/te/B7ZJX92J2N/'
    expect(response.status).to eq 200
  end
end
