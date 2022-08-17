# frozen_string_literal: true

require 'rails_helper'

describe PlaylistItemsController, type: :request do
  before do
    l_bundle_json = File.open(Rails.root.join('spec/fixtures/payloads/l_bundle_te_PG3Z16Q145.json')) do |file|
      json_string = file.read
      JSON.parse(json_string, symbolize_names: true)
    end

    t_json = File.open(Rails.root.join('spec/fixtures/payloads/t_te_PG3Z16Q145.json')) do |file|
      json_string = file.read
      JSON.parse(json_string, symbolize_names: true)
    end

    dlab_client = instance_double(DlabApiClient)
    allow(DlabApiClient).to receive(:new).and_return(dlab_client)
    allow(dlab_client).to receive(:episode_l_bundle).with(type: 'tv',
                                                          episode_id: stub_episode_id).and_return(l_bundle_json)
    allow(dlab_client).to receive(:episode).with(type: 'tv', episode_id: stub_episode_id).and_return(t_json)

    poc_client = instance_double(PocApiClient)
    allow(PocApiClient).to receive(:new).and_return(poc_client)
    allow(poc_client).to receive(:episode).with(episode_id: anything).and_return({})
    allow(poc_client).to receive(:playlist_ll_bundle).with(playlist_id: anything).and_return({})
  end

  let(:stub_episode_id) { 'PG3Z16Q145' }

  describe 'GET #index' do
    let(:playlist) {
      create(:playlist, id: '52', playlist_items: [playlist_item])
    }     # playlist_string_idはidから生成されるため、idはstubに合わせて固定値にする
    let(:playlist_item) { create(:playlist_item, episode_id: stub_episode_id) }

    it 'returns success response' do
      get "/playlists/#{playlist.string_uid}/playlist_items"
      expect(response.status).to eq 200
    end
  end

  describe 'POST #bulk_update' do
    let(:playlist) { create(:playlist) }
    let(:params) { { playlist_items: episode_ids } }
    let(:stub_episode_id) { 'NEWEP1' }
    let(:episode_ids) { [{ id: stub_episode_id }] }

    it 'returns success response' do
      post "/playlists/#{playlist.string_uid}/playlist_items/bulk_update", params: params
      expect(response.status).to eq 200
      expect(playlist.playlist_items.count).to eq 1
    end
  end
end
