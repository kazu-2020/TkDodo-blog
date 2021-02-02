# frozen_string_literal: true

describe External::PlaylistsController, type: :request do
  describe 'GET #show' do
    let(:playlist) { create(:playlist) }

    it 'returns success response' do
      get "/d6.6/t/nplaylist/pl/#{playlist.original_id}.json"
      expect(response.status).to eq 200
    end
  end
end
