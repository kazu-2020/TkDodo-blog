# frozen_string_literal: true

require 'rails_helper'

describe External::PlaylistsController, type: :request do
  describe 'GET #show' do
    let(:playlist) { create(:playlist) }

    it 'returns success response' do
      get "/d6.6/t/nplaylist/id/#{playlist.string_id}.json"
      expect(response.status).to eq 200
    end
  end

  describe '/l/bundle/pl/' do
    let(:playlist) { create(:playlist) }

    it do
      get "/d6.6/l/bundle/pl/#{playlist.original_id}/types.json"
      expect(response.status).to eq 200
      body = JSON.parse(response.body, symbolize_names: true)
      expect(body.key?(:narticle)).to eq playlist.deliver_article_via_api?
    end
  end

  describe '/ll/bundle/pl/' do
    let(:playlist) { create(:playlist, publish_level: publish_level) }

    context 'publish level is full' do
      let(:publish_level) { :full }

      it do
        get "/d6.6/ll/bundle/pl/#{playlist.original_id}/types.json"
        expect(response.status).to eq 200
        body = JSON.parse(response.body, symbolize_names: true)
        expect(body.key?(:faqpage)).to eq playlist.deliver_faq_page_via_api?
        expect(body.key?(:howto)).to eq playlist.deliver_how_to_via_api?
        expect(body.key?(:event)).to eq playlist.deliver_event_via_api?
      end
    end

    context 'publish level is not full' do
      let(:publish_level) { Playlist::PUBLISH_LEVELS.reject { |v| v == :full }.sample }

      it do
        get "/d6.6/ll/bundle/pl/#{playlist.original_id}/types.json"
        expect(response.status).to eq 200
        body = JSON.parse(response.body, symbolize_names: true)
        expect(body).to_not include(:faqpage)
        expect(body).to_not include(:howto)
        expect(body).to_not include(:event)
      end
    end
  end

  describe '/lll/bundle/pl/' do
    let(:playlist) { create(:playlist, publish_level: publish_level) }

    context 'publish level is full' do
      let(:publish_level) { :full }

      it do
        get "/d6.6/lll/bundle/pl/#{playlist.original_id}/types.json"
        expect(response.status).to eq 200

        body = JSON.parse(response.body, symbolize_names: true)
        deliver_item_list = playlist.deliver_item_list_via_api?
        expect(body.key?(:faqpage)).to eq deliver_item_list && playlist.deliver_faq_page_via_api?
        expect(body.key?(:howto)).to eq deliver_item_list && playlist.deliver_how_to_via_api?
        expect(body.key?(:event)).to eq deliver_item_list && playlist.deliver_event_via_api?
      end
    end

    context 'publish level is not full' do
      let(:publish_level) { Playlist::PUBLISH_LEVELS.reject { |v| v == :full }.sample }

      it do
        get "/d6.6/lll/bundle/pl/#{playlist.original_id}/types.json"
        expect(response.status).to eq 200

        body = JSON.parse(response.body, symbolize_names: true)
        expect(body).to_not include(:faqpage)
        expect(body).to_not include(:howto)
        expect(body).to_not include(:event)
      end
    end
  end
end
