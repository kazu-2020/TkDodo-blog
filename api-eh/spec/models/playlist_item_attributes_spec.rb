# frozen_string_literal: true

require 'rails_helper'

describe PlaylistItemAttributes, type: :model do
  let(:playlist) { create(:playlist) }

  describe '#total_time' do
    before do
      create(:playlist_item, episode_id: 'Y6J1Y3MK82', playlist: playlist) # duration: 1500, has_video: true
      create(:playlist_item, episode_id: 'G9829WW2WW', playlist: playlist) # duration: 1500, has_video: false
    end

    it do
      VCR.use_cassette('models/playlist_item_attributes_spec/total_time') do
        expect(playlist.reload.total_time.to_i).to eq(1800)
      end
    end
  end

  describe '#playlist_items_count' do
    before do
      create(:playlist_item, episode_id: 'Y6J1Y3MK82', playlist: playlist) # duration: 1500, has_video: true
      create(:playlist_item, episode_id: 'G9829WW2WW', playlist: playlist) # duration: 1500, has_video: false
    end

    it do
      expect(playlist.reload.playlist_items_count).to eq(2)
    end
  end

  describe '#playable_total_time' do
    before do
      create(:playlist_item, episode_id: 'Y6J1Y3MK82', playlist: playlist) # duration: 1500, has_video: true
      create(:playlist_item, episode_id: 'G9829WW2WW', playlist: playlist) # duration: 1500, has_video: false
    end

    it do
      VCR.use_cassette('models/playlist_item_attributes_spec/playable_total_time') do
        expect(playlist.reload.playable_total_time).to eq(300)
      end
    end
  end

  describe '#playable_playlist_items_count' do
    before do
      create(:playlist_item, episode_id: 'Y6J1Y3MK82', playlist: playlist) # duration: 1500, has_video: true
      create(:playlist_item, episode_id: 'G9829WW2WW', playlist: playlist) # duration: 1500, has_video: false
    end

    it do
      VCR.use_cassette('models/playlist_item_attributes_spec/playable_playlist_items_count') do
        expect(playlist.reload.playable_playlist_items_count).to eq(1)
      end
    end
  end

  describe '#faq_page_count' do
    before do
      create(:playlist_item, episode_id: 'WWXQGK6938', playlist: playlist) # faq
      create(:playlist_item, episode_id: 'KZ2MN6PXRJ', playlist: playlist) # howto
      create(:playlist_item, episode_id: 'XKNVY22PNP', playlist: playlist) # event
    end

    it do
      VCR.use_cassette('models/playlist_item_attributes_spec/sub_types_count') do
        expect(playlist.reload.faq_page_count).to eq(1)
      end
    end
  end

  describe '#event_count' do
    before do
      create(:playlist_item, episode_id: 'WWXQGK6938', playlist: playlist) # faq
      create(:playlist_item, episode_id: 'KZ2MN6PXRJ', playlist: playlist) # howto
      create(:playlist_item, episode_id: 'XKNVY22PNP', playlist: playlist) # event
    end

    it do
      VCR.use_cassette('models/playlist_item_attributes_spec/sub_types_count') do
        expect(playlist.reload.event_count).to eq(1)
      end
    end
  end

  describe '#how_to_count' do
    before do
      create(:playlist_item, episode_id: 'WWXQGK6938', playlist: playlist) # faq
      create(:playlist_item, episode_id: 'KZ2MN6PXRJ', playlist: playlist) # howto
      create(:playlist_item, episode_id: 'XKNVY22PNP', playlist: playlist) # event
    end

    it do
      VCR.use_cassette('models/playlist_item_attributes_spec/sub_types_count') do
        expect(playlist.reload.how_to_count).to eq(1)
      end
    end
  end
end
