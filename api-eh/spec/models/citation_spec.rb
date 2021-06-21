# frozen_string_literal: true

require 'rails_helper'

describe Citation, type: :model do
  context 'validations' do
    context '#url' do
      let(:playlist) { build(:playlist) }
      let(:citation) { build(:citation, url: url, playlist: playlist) }

      context 'when valid url' do
        let(:url) { 'https://example.com' }
        it { expect(citation).to be_valid }
      end

      context 'when invalid url' do
        let(:url) { 'invalidurl' }
        it { expect(citation).to be_invalid }
      end
    end
  end
end
