# frozen_string_literal: true

require 'rails_helper'

describe SameAs, type: :model do
  context 'validations' do
    describe '#url' do
      let(:playlist) { build(:playlist) }
      let(:same_as) { build(:same_as, url: url, playlist: playlist) }

      context 'when valid url' do
        let(:url) { 'https://example.com' }

        it { expect(same_as).to be_valid }
      end

      context 'when invalid url' do
        let(:url) { 'invalidurl' }

        it { expect(same_as).to be_invalid }
      end
    end
  end
end
