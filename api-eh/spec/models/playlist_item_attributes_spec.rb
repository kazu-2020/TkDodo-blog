# frozen_string_literal: true

require 'rails_helper'

describe PlaylistItemAttributes, type: :model do
  let(:playlist) { create(:playlist) }
  let(:has_all_subtype_playlist) { create(:playlist, id: '52') } # 20220803時点でHowto,Faqpage,Eventのsubtypeが含まれるPlaylist

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

  # 20220708時点で視聴可能なエピソードを2件含むプレイリストをmockとして使用しています
  describe '#playable_playlist_items_count' do
    before do
      create(:playlist_item, playlist: playlist)

      playlist_json = File.open(Rails.root.join(
                                  'spec/fixtures/payloads/r6.0_l_tvepisode_pl_recommend-tep-0000000055.json'
                                )) do |file|
        json_string = file.read
        JSON.parse(json_string, symbolize_names: true)
      end

      poc_client = instance_double(PocApiClient)
      allow(PocApiClient).to receive(:new).and_return(poc_client)
      allow(poc_client).to receive(:available_episode_from_playlist).with(playlist.string_id).and_return(playlist_json)
    end

    it do
      expect(playlist.reload.playable_playlist_items_count(playlist.string_id)).to eq(2)
    end
  end

  describe '#faq_page_count' do
    before do
      create(:playlist_item, episode_id: 'WWXQGK6938', playlist: has_all_subtype_playlist)
    end

    it do
      VCR.use_cassette('models/playlist_item_attributes_spec/sub_types_count') do
        expect(has_all_subtype_playlist.faq_page_count(has_all_subtype_playlist.string_id)).to eq(2)
      end
    end
  end

  describe '#event_count' do
    before do
      create(:playlist_item, episode_id: 'WWXQGK6938', playlist: has_all_subtype_playlist)
    end

    it do
      VCR.use_cassette('models/playlist_item_attributes_spec/sub_types_count') do
        expect(has_all_subtype_playlist.reload.event_count(has_all_subtype_playlist.string_id)).to eq(9)
      end
    end
  end

  describe '#how_to_count' do
    before do
      create(:playlist_item, episode_id: 'WWXQGK6938', playlist: has_all_subtype_playlist)
    end

    it do
      VCR.use_cassette('models/playlist_item_attributes_spec/sub_types_count') do
        expect(has_all_subtype_playlist.reload.how_to_count(has_all_subtype_playlist.string_id)).to eq(7)
      end
    end
  end
end
