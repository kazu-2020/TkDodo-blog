# frozen_string_literal: true

require 'rails_helper'

describe PocApiClient, type: :model do
  describe '#episode' do
    let(:episode_id) { '7WVY258P7G' }

    it do
      VCR.use_cassette('services/poc_api_client_spec/episode') do
        episode_res = described_class.new.episode(episode_id: episode_id)
        expect(episode_res).to be_a(Hash)
      end
    end
  end
end
