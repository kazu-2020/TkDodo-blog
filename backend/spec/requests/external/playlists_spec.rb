# frozen_string_literal: true

describe External::PlaylistsController, type: :request do
  describe 'GET #show' do
    let(:playlist) { create(:playlist) }

    context 'When passed original playlist id' do
      it 'returns success response' do
        get "/d6.6/t/nplaylist/pl/#{playlist.original_id}.json"
        expect(response.status).to eq 200
      end
    end

    context 'When passed playlist uid' do
      it 'returns success response' do
        get "/d6.6/t/nplaylist/id/#{playlist.string_id}.json"
        expect(response.status).to eq 200
      end
    end
  end
end
