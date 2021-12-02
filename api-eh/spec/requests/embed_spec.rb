# frozen_string_literal: true

require 'rails_helper'

describe EmbedController, type: :request do
  describe 'Series' do
    let(:series_id) { 'R71NJ4MV53' }

    describe 'summary' do
      let(:layout_pattern) { 'summary' }

      it 'returns success response' do
        VCR.use_cassette('dlab_api_series') do
          get "/embed/ts/#{series_id}", params: { layout_pattern: layout_pattern }
          expect(response.status).to eq 200
        end
      end
    end

    describe 'featuredItem' do
      let(:layout_pattern) { 'featuredItem' }

      it 'returns success response' do
        VCR.use_cassette('dlab_api_episode_from_series') do
          get "/embed/ts/#{series_id}", params: { layout_pattern: layout_pattern }
          expect(response.status).to eq 200
        end
      end
    end

    describe 'itemList' do
      let(:layout_pattern) { 'itemList' }

      it 'returns success response' do
        VCR.use_cassette('embed_spec_ts_item_list') do
          get "/embed/ts/#{series_id}", params: { layout_pattern: layout_pattern }
          expect(response.status).to eq 200
        end
      end
    end

    describe 'largeImage' do
      let(:layout_pattern) { 'largeImage' }

      it 'returns success response' do
        VCR.use_cassette('dlab_api_episode_from_series') do
          get "/embed/ts/#{series_id}", params: { layout_pattern: layout_pattern }
          expect(response.status).to eq 200
        end
      end
    end
  end

  describe 'Playlist' do
    before do
      client = instance_double(DlabApiClient)
      allow(DlabApiClient).to receive(:new).and_return(client)
      allow(client).to receive(:episode_list_bundle).with(type: 'tv', episode_id: anything).and_return({})
      allow(client).to receive(:episode).with(type: 'tv', episode_id: anything).and_return({})
    end

    let(:playlist) { create(:playlist, :with_playlist_item) }
    let(:playlist_id) { format('%010<number>d', number: playlist.id) }

    describe 'summary' do
      let(:layout_pattern) { 'summary' }

      it 'returns success response' do
        get "/embed/pl/eh-#{playlist_id}", params: { layout_pattern: layout_pattern }
        expect(response.status).to eq 200
      end
    end

    describe 'featuredItem' do
      let(:layout_pattern) { 'featuredItem' }

      before do
        playlist.playlist_items.first.update(episode_id: 'GXLN8793GK')
      end

      it 'returns success response' do
        VCR.use_cassette('embed_spec_pl_featured_item') do
          get "/embed/pl/eh-#{playlist_id}", params: { layout_pattern: layout_pattern }
          expect(response.status).to eq 200
        end
      end
    end

    describe 'itemList' do
      let(:layout_pattern) { 'itemList' }

      before do
        playlist.playlist_items.first.update(episode_id: 'GXLN8793GK')
      end

      it 'returns success response' do
        VCR.use_cassette('embed_spec_pl_featured_item') do
          get "/embed/pl/eh-#{playlist_id}", params: { layout_pattern: layout_pattern }
          expect(response.status).to eq 200
        end
      end
    end

    describe 'largeImage' do
      let(:layout_pattern) { 'largeImage' }

      before do
        playlist.playlist_items.first.update(episode_id: 'GXLN8793GK')
      end

      it 'returns success response' do
        VCR.use_cassette('embed_spec_pl_featured_item') do
          get "/embed/pl/eh-#{playlist_id}", params: { layout_pattern: layout_pattern }
          expect(response.status).to eq 200
        end
      end
    end
  end

  describe 'SeriesPlaylist' do
    let(:series_id) { 'R71NJ4MV53' }

    describe 'summary' do
      let(:layout_pattern) { 'summary' }

      it 'returns success response' do
        VCR.use_cassette('dlab_api_series') do
          get "/embed/pl/ts-#{series_id}", params: { layout_pattern: layout_pattern }
          expect(response.status).to eq 200
        end
      end
    end

    describe 'featuredItem' do
      let(:layout_pattern) { 'featuredItem' }

      it 'returns success response' do
        VCR.use_cassette('dlab_api_episode_from_series') do
          get "/embed/pl/ts-#{series_id}", params: { layout_pattern: layout_pattern }
          expect(response.status).to eq 200
        end
      end
    end

    describe 'itemList' do
      let(:layout_pattern) { 'itemList' }

      it 'returns success response' do
        VCR.use_cassette('embed_spec_d65_item_list') do
          get "/embed/pl/ts-#{series_id}", params: { layout_pattern: layout_pattern }
          expect(response.status).to eq 200
        end
      end
    end
  end

  describe 'Episode' do
    it 'returns success response' do
      series_id = 'R71NJ4MV53'
      episode_id = 'B7ZJX92J2N'
      VCR.use_cassette('embed_spec_episode') do
        get "/embed/ts/#{series_id}/episode/te/#{episode_id}"
        expect(response.status).to eq 200
      end
    end
  end

  describe 'Howto' do
    it 'returns success response' do
      episode_id = '8X5KKJ1W5Y'
      howto_id = '49'
      VCR.use_cassette('embed_spec_howto') do
        get "/embed/te/#{episode_id}/howto/#{howto_id}"
        expect(response.status).to eq 200
      end
    end
  end

  describe 'Event' do
    it 'returns success response' do
      episode_id = 'GV711R4WQV'
      event_id = '94'
      VCR.use_cassette('embed_spec_event') do
        get "/embed/te/#{episode_id}/event/#{event_id}"
        expect(response.status).to eq 200
      end
    end
  end

  describe 'Faqpage' do
    it 'returns success response' do
      episode_id = '7NL2777YGX'
      faqpage_id = '54'
      VCR.use_cassette('embed_spec_faqpage') do
        get "/embed/te/#{episode_id}/faqpage/#{faqpage_id}"
        expect(response.status).to eq 200
      end
    end
  end
end
