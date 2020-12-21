# frozen_string_literal: true

require 'spec_helper'

describe PlaylistKeyword, type: :model do
  context 'validations' do
    context '#name' do
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
