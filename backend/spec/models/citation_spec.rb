# frozen_string_literal: true

require 'spec_helper'

describe Citation, type: :model do
  context 'validations' do
    context '#url' do
      let(:citation) { build(:citation, url: url) }

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
