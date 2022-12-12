require 'rails_helper'

describe 'DlabApiBase' do
  describe 'r6リクエストの場合' do
    it 'リクエストヘッダにUserAgentが設定されいてること' do
      client = DlabApiClient.new
      client.send(:client)

      VCR.use_cassette('/services/dlab_api_base/r6_request') do
        response = client.send(:client).get('/r6/s/extended.json')
        expect(response.env.request_headers['User-Agent']).to eq 'editorialhands'
      end
    end
  end

  describe 'r6.0リクエストの場合' do
    it 'リクエストヘッダにUserAgentが設定されいてること' do
      client = PocApiClient.new
      client.send(:client)

      VCR.use_cassette('/services/dlab_api_base/r6.0_request') do
        response = client.send(:client).get('/r6.0/s/extended.json')
        expect(response.env.request_headers['User-Agent']).to eq 'editorialhands'
      end
    end
  end
end
