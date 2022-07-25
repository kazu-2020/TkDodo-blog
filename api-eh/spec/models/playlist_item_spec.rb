# frozen_string_literal: true

require 'rails_helper'

describe PlaylistItem, type: :model do
  context 'validations' do
    let(:playlist_item) { build(:playlist_item) }

    it 'is valid' do
      expect(playlist_item).to be_valid
    end
  end

  describe 'caches' do
    describe '#episode_data' do
      let(:playlist_item) { build(:playlist_item, episode_id: playable_episode_id) }
      let(:playable_episode_id) { 'Y6J1Y3MK82' }

      it do
        VCR.use_cassette('models/playlist_item_spec/caches/episode_data') do
          expect(playlist_item.episode_data).not_to be_nil
        end
      end
    end

    describe '#fetch_bundle_data' do
      let(:playlist_item) { build(:playlist_item, episode_id: playable_episode_id) }
      let(:playable_episode_id) { 'Y6J1Y3MK82' }

      it do
        VCR.use_cassette("r6/l/bundle/te/#{playable_episode_id}.json?extendedEntities=true&ignoreRange=true") do
          expect(playlist_item.fetch_bundle_data).not_to be_nil
        end
      end
    end

    describe '#fetch_episode_videos_data' do
      let(:playlist_item) { build(:playlist_item, episode_id: episode_id) }

      context 'r6で引けてr6.0で引けないEpisodeの場合' do
        let(:episode_id) { 'R7VMXV59JP' }

        it 'エラーにならないこと' do
          VCR.use_cassette('models/playlist_item_spec/caches/fetch_episode_videos_data') do
            expect(playlist_item.episode_data).not_to be_nil
          end
        end
      end
    end

    describe '#duration' do
      let(:playlist_item) { build(:playlist_item, episode_id: playable_episode_id) }
      let(:playable_episode_id) { 'Y6J1Y3MK82' } # duration 1500.0

      it do
        VCR.use_cassette("r6/l/bundle/te/#{playable_episode_id}.json?extendedEntities=true&ignoreRange=true") do
          expect(playlist_item.duration.to_i).to eq 1500
        end
      end
    end

    describe '#has_video' do
      let(:playlist_item) { build(:playlist_item, episode_id: playable_episode_id) }
      let(:playable_episode_id) { 'Q8MP4RXRJW' } # 2022/07/27時点で視聴可能なエピソード

      context '視聴可能なエピソードの場合' do
        it do
          VCR.use_cassette("r6/l/bundle/te/#{playable_episode_id}.json?extendedEntities=true&ignoreRange=true") do
            expect(playlist_item.has_video).to be_truthy
          end
        end
      end
    end

    describe '#has_how_to' do
      let(:playlist_item) { build(:playlist_item, episode_id: playable_episode_id) }
      let(:playable_episode_id) { 'KZ2MN6PXRJ' }

      it do
        VCR.use_cassette("r6/l/bundle/te/#{playable_episode_id}.json?extendedEntities=true&ignoreRange=true") do
          expect(playlist_item.has_how_to).to be_truthy
        end
      end
    end

    describe '#has_event' do
      let(:playlist_item) { build(:playlist_item, episode_id: playable_episode_id) }
      let(:playable_episode_id) { 'XKNVY22PNP' }

      it do
        VCR.use_cassette("r6/l/bundle/te/#{playable_episode_id}.json?extendedEntities=true&ignoreRange=true") do
          expect(playlist_item.has_event).to be_truthy
        end
      end
    end

    describe '#has_faq_page' do
      let(:playlist_item) { build(:playlist_item, episode_id: playable_episode_id) }
      let(:playable_episode_id) { 'WWXQGK6938' }

      it do
        VCR.use_cassette("r6/l/bundle/te/#{playable_episode_id}.json?extendedEntities=true&ignoreRange=true") do
          expect(playlist_item.has_faq_page).to be_truthy
        end
      end
    end
  end
end
