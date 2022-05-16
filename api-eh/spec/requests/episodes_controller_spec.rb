# frozen_string_literal: true

require 'rails_helper'

describe EpisodesController, type: :request do
  describe 'GET #search' do
    before { create(:playlist_item) }

    it 'returns success response' do
      VCR.use_cassette('requests/episode_spec/search_episodes_path') do
        get search_episodes_path
        expect(response.status).to eq 200
      end
    end
  end
end
