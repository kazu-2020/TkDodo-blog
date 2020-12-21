# frozen_string_literal: true

require 'spec_helper'

describe PlaylistHashtag, type: :model do
  context 'validations' do
    context '#name' do
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
