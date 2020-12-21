# frozen_string_literal: true

require 'spec_helper'

describe PlaylistItem, type: :model do
  context 'validations' do
    let(:playlist_item) { build(:playlist_item) }

    it 'is valid' do
      expect(playlist_item).to be_valid
    end
  end
end
