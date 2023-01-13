require 'rails_helper'

RSpec.describe Announcement do
  describe '#valid?' do
    subject { described_class.new(params) }

    let(:params) { { contents: contents } }

    context 'contentsがnilの場合' do
      let(:contents) { nil }

      it { is_expected.to be_invalid }
    end

    context 'contentsが空文字の場合' do
      let(:contents) { '' }

      it { is_expected.to be_invalid }
    end
  end

  describe 'enum' do
    it 'self#statuses' do
      expect(described_class.statuses).to eq({
                                               'general' => 0,
                                               'improved' => 1,
                                               'maintenance' => 2,
                                               'attentive' => 3,
                                               'emergency' => 4
                                             })
    end
  end
end
