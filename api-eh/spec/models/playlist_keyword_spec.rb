# frozen_string_literal: true

require 'rails_helper'

describe PlaylistKeyword do
  context 'validations' do
    describe '#name' do
      before do
        poc_client = instance_double(PocApiClient)
        allow(PocApiClient).to receive(:new).and_return(poc_client)
        allow(poc_client).to receive(:playlist_ll_bundle).with(playlist_id: anything).and_return({})
      end

      let(:playlist_keyword) { build(:playlist_keyword, name: name) }

      context 'when name is present' do
        let(:name) { 'Awesome keyword' }

        it { expect(playlist_keyword).to be_valid }
      end

      context 'when name does not present' do
        let(:name) { nil }

        it { expect(playlist_keyword).to be_invalid }
      end

      context 'when name is already exists' do
        let(:name) { 'keyword1' }
        let(:playlist) { create(:playlist) }
        let(:playlist_keyword) { build(:playlist_keyword, name: name, playlist: playlist) }

        before { create(:playlist_keyword, name: name, playlist: playlist) }

        it 'does not valid record' do
          expect(playlist_keyword).to be_invalid
        end
      end
    end
  end
end
