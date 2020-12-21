# frozen_string_literal: true

describe PlaylisticlesController, type: :request do
  before do
    json = File.open(Jets.root.join('spec/fixtures/payloads/d65_pl_ts_QLZLXN22G2.json')) do |file|
      json_string = file.read
      JSON.parse(json_string, symbolize_names: true)
    end
    client = instance_double(DlabExperimentalApiClient)
    allow(DlabExperimentalApiClient).to receive(:new).and_return(client)
    allow(client).to receive(:playlist).with(series_id: 'QLZLXN22G2').and_return(json)
  end

  describe 'GET #sandbox' do
    it 'リクエストが成功すること' do
      get sandbox_playlisticles_url
      expect(response.status).to eq 200
    end
  end

  describe 'GET #sandbox_word' do
    it 'リクエストが成功すること' do
      get sandbox_word_playlisticles_url
      expect(response.status).to eq 200
    end
  end
end
