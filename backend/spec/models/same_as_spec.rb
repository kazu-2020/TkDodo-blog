# frozen_string_literal: true

require 'spec_helper'

describe SameAs, type: :model do
  context 'validations' do
    context '#url' do
      let(:same_as) { build(:same_as, url: url) }

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
