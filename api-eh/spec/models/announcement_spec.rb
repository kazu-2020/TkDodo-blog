require 'rails_helper'

RSpec.describe Announcement do
  describe '#valid?' do
    subject { Announcement.new(params) }
    let(:params) {{ contents: contents }}

    context 'contentsがnilの場合' do
      let(:contents) { nil }

      it { is_expected.to be_invalid }
    end

    context 'contentsが空文字の場合' do
      let(:contents) { '' }

      it { is_expected.to be_invalid }
    end
  end
end
