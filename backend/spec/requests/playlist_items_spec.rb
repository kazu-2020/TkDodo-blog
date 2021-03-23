# frozen_string_literal: true

describe PlaylistItemsController, type: :request do
  before do
    json = File.open(Jets.root.join('spec/fixtures/payloads/ts_bundle_6X8L7Z8VK8.json')) do |file|
      json_string = file.read
      JSON.parse(json_string, symbolize_names: true)
    end
    client = instance_double(DlabApiClient)
    allow(DlabApiClient).to receive(:new).and_return(client)
    allow(client).to receive(:episode_bundle).with(type: 'tv', episode_id: stub_episode_id).and_return(json)
    allow(client).to receive(:broadcast_event_from_episode_id).with(stub_episode_id).and_return({ result: [] })
  end

  let(:stub_episode_id) { 'PG3Z16Q145' }

  describe 'GET #index' do
    let(:playlist) { create(:playlist, playlist_items: [playlist_item]) }
    let(:playlist_item) { create(:playlist_item, episode_id: stub_episode_id) }

    it 'returns success response' do
      get "playlists/#{playlist.string_id}/playlist_items"
      expect(response.status).to eq 200
    end
  end

  describe 'POST #bulk_update' do
    let(:playlist) { create(:playlist) }
    let(:params) { { playlist_items: episode_ids } }
    let(:episode_ids) { [{ id: stub_episode_id }] }

    it 'returns success response' do
      post "playlists/#{playlist.string_id}/playlist_items/bulk_update", params: params
      expect(response.status).to eq 200
      expect(playlist.playlist_items.kept.count).to eq 1
    end
  end
end
