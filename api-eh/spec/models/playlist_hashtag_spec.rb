# frozen_string_literal: true

require 'rails_helper'

describe PlaylistHashtag do
  context 'validations' do
    describe '#name' do
      before do
        poc_client = instance_double(PocApiClient)
        allow(PocApiClient).to receive(:new).and_return(poc_client)
        allow(poc_client).to receive(:playlist_ll_bundle).with(playlist_id: anything).and_return({})
      end

      let(:playlist_hashtag) { build(:playlist_hashtag, name: name) }

      context 'when name is present' do
        let(:name) { 'Awesome keyword' }

        it { expect(playlist_hashtag).to be_valid }
      end

      context 'when name does not present' do
        let(:name) { nil }

        it { expect(playlist_hashtag).to be_invalid }
      end

      context 'when name is already exists' do
        let(:name) { '#hashtag1' }
        let(:playlist) { create(:playlist) }
        let(:playlist_hashtag) { build(:playlist_hashtag, name: name, playlist: playlist) }

        before { create(:playlist_hashtag, name: name, playlist: playlist) }

        it 'does not valid record' do
          expect(playlist_hashtag).to be_invalid
        end
      end
    end
  end
end
