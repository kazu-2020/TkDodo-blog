# frozen_string_literal: true

require 'rails_helper'

describe External::PlaylistsController, type: :request do
  describe 'GET #show' do
    let(:playlist) { create(:playlist) }

    it 'returns success response' do
      get "/d6.6/t/nplaylist/id/#{playlist.string_id}.json"
      expect(response.status).to eq 200
    end
  end
end
