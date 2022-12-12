require 'rails_helper'

describe 'DlabApiBase' do
  describe '#client' do
    let(:dlab_api_base) { DlabApiBase.new }

    it 'succeeds' do
      client = DlabApiClient.new
      client.send(:client)

      VCR.use_cassette('/services/dlab_api_base/r6_request') do
        response = client.send(:client).get('/r6/s/extended.json')
        expect(response.headers['User-Agent']).to eq 'editorialhands'
      end
    end
  end
end
