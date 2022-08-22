require 'rails_helper'

describe SeriesPlaylist, type: :model do
  let(:series_playlist) { create(:series_playlist, string_id: 'ts-R7Y6NGLJ6G', series_id: 'R7Y6NGLJ6G') }

  describe '#name' do
    it 'シリーズ名が取得できること' do
      VCR.use_cassette('models/series_playlist_spec/series_playlist_name') do
        expect(series_playlist.name).to eq('クローズアップ現代')
      end
    end
  end

  describe '#logo' do
    it 'ロゴが取得できること' do
      VCR.use_cassette('models/series_playlist_spec/series_playlist_logo') do
        expect(series_playlist.logo).not_to be_nil
      end
    end
  end

  describe '#videos' do
    it 'ビデオが取得できること' do
      VCR.use_cassette('models/series_playlist_spec/series_playlist_videos') do
        expect(series_playlist.videos).not_to be_nil
      end
    end
  end

  describe '#episodes' do
    it 'エピソードが取得できること' do
      VCR.use_cassette('models/series_playlist_spec/series_playlist_episodes') do
        expect(series_playlist.episodes[:count]).to eq(379) # 2022/08/17時点
      end
    end
  end

  describe '#episode_count' do
    it 'エピソード件数が取得できること' do
      VCR.use_cassette('models/series_playlist_spec/series_playlist_episode_count') do
        expect(series_playlist.episode_count).to eq(379) # 2022/08/17時点
      end
    end
  end

  describe '#howto_count' do
    it 'how to件数が取得できること' do
      VCR.use_cassette('models/series_playlist_spec/series_playlist_howto_count') do
        expect(series_playlist.howto_count).to eq(31) # 2022/08/17時点
      end
    end
  end

  describe '#event_count' do
    it 'event件数が取得できること' do
      VCR.use_cassette('models/series_playlist_spec/series_playlist_event_count') do
        expect(series_playlist.event_count).to eq(29) # 2022/08/17時点
      end
    end
  end

  describe '#faqpage_count' do
    it 'faq page件数が取得できること' do
      VCR.use_cassette('models/series_playlist_spec/series_playlist_faqpage_count') do
        expect(series_playlist.faqpage_count).to eq(21) # 2022/08/17時点
      end
    end
  end

  describe '#recipe_count' do
    it 'レシピの件数が取得できること' do
      VCR.use_cassette('models/series_playlist_spec/series_playlist_recipe_count') do
        expect(series_playlist.recipe_count).to eq(17) # 2022/08/17時点
      end
    end
  end
end
