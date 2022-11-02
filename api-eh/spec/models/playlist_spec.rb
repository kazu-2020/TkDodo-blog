# frozen_string_literal: true

require 'rails_helper'

describe Playlist, type: :model do
  before do
    poc_client = instance_double(PocApiClient)
    allow(PocApiClient).to receive(:new).and_return(poc_client)
    allow(poc_client).to receive(:playlist_ll_bundle).with(playlist_id: anything).and_return({})
  end

  context 'validations' do
    context 'for color code' do
      let(:playlist) { build(:playlist, selected_palette: color) }
      let(:color) { '#ffffff' }

      it 'is valid' do
        expect(playlist).to be_valid
      end

      context 'When invalid color code' do
        let(:color) { '#ff' }

        it 'does not valid' do
          expect(playlist).not_to be_valid
        end
      end
    end
  end

  describe '#before_create' do
    let(:playlist) { build(:playlist) }

    it 'assigned an ID with a random string of characters' do
      expect do
        playlist.save
      end.to change {
        playlist.string_id.present?
      }.from(false).to(true)
    end

    describe '#set_default_color' do
      context 'when colors does not set' do
        it 'assigned default colors' do
          playlist.save
          expect(playlist.reload.selected_palette).to eq('#84919e')
          expect(playlist.reload.primary_light_color).to eq('#84919e')
          expect(playlist.reload.primary_dark_color).to eq('#84919e')
          expect(playlist.reload.text_light_color).to eq('#000000')
          expect(playlist.reload.text_dark_color).to eq('#ffffff')
          expect(playlist.reload.link_light_color).to eq('#6a757f')
          expect(playlist.reload.link_dark_color).to eq('#84919e')
        end
      end

      context 'when colors already set' do
        let(:playlist) do
          build(:playlist,
                selected_palette: selected_palette,
                primary_light_color: primary_light_color,
                primary_dark_color: primary_dark_color,
                text_light_color: text_light_color,
                text_dark_color: text_dark_color,
                link_light_color: link_light_color,
                link_dark_color: link_dark_color)
        end
        let(:selected_palette) { '#cc5858' }
        let(:primary_light_color) { '#cc5858' }
        let(:primary_dark_color) { '#cc5858' }
        let(:text_light_color) { '#bd5151' }
        let(:text_dark_color) { '#d06565' }
        let(:link_light_color) { '#bd5151' }
        let(:link_dark_color) { '#d06565' }

        it 'does not assign default colors' do
          playlist.save
          expect(playlist.reload.selected_palette).to eq(selected_palette)
          expect(playlist.reload.primary_light_color).to eq(primary_light_color)
          expect(playlist.reload.primary_dark_color).to eq(primary_dark_color)
          expect(playlist.reload.text_light_color).to eq(text_light_color)
          expect(playlist.reload.text_dark_color).to eq(text_dark_color)
          expect(playlist.reload.link_light_color).to eq(link_light_color)
          expect(playlist.reload.link_dark_color).to eq(link_dark_color)
        end
      end
    end

    describe '#set_default_editor_info' do
      context 'when not set' do
        it do
          playlist.save
          playlist.reload
          expect(playlist.author_name).to eq('NHK')
          expect(playlist.author_type).to eq('Organization')
          expect(playlist.publisher_name).to eq('NHK')
          expect(playlist.publisher_type).to eq('Organization')
        end
      end

      context 'when already set' do
        let(:playlist) do
          build(:playlist,
                author_name: author_name,
                author_type: author_type,
                publisher_name: publisher_name,
                publisher_type: publisher_type)
        end
        let(:author_name) { 'author' }
        let(:author_type) { 'Person' }
        let(:publisher_name) { 'publisher' }
        let(:publisher_type) { 'Person' }

        it do
          playlist.save
          playlist.reload
          expect(playlist.author_name).to eq(author_name)
          expect(playlist.author_type).to eq(author_type)
          expect(playlist.publisher_name).to eq(publisher_name)
          expect(playlist.publisher_type).to eq(publisher_type)
        end
      end
    end
  end

  describe '#rebuild_episode_list_to' do
    let(:playlist) { create(:playlist, :with_playlist_items) }

    context 'when new episodes added' do
      let(:episode_ids) do
        ['NEWEP1', playlist.playlist_items.pluck(:episode_id)].flatten
      end

      it 'includes new episodes to the playlist' do
        expect do
          playlist.rebuild_episode_list_to(episode_ids)
        end.to change {
          playlist.reload.playlist_items.count
        }.from(2).to(3)
      end
    end

    context 'when old episodes removed' do
      let(:episode_ids) do
        [playlist.playlist_items.pluck(:episode_id).first]
      end

      it 'does not include old episodes to the playlist' do
        expect do
          playlist.rebuild_episode_list_to(episode_ids)
        end.to change {
          playlist.reload.playlist_items.count
        }.from(2).to(1)
      end
    end

    context 'when episode were reordered' do
      let(:current_episode_ids) { playlist.playlist_items.pluck(:episode_id) }
      let(:episode_ids) do
        [current_episode_ids.second, 'NEWEP1', current_episode_ids.first]
      end

      it 'reorder playlist episodes' do
        playlist.rebuild_episode_list_to(episode_ids)

        expect(playlist.playlist_items.pluck(:episode_id)).to eq(episode_ids)
      end
    end
  end

  describe '#keyword=' do
    let(:playlist) { create(:playlist) }
    let(:keywords) { %w[keyword1 keyword2] }

    it 'saves keywords as PlaylistKeyword' do
      expect do
        playlist.keywords = keywords
      end.to change(PlaylistKeyword, :count).from(0).to(2)
    end
  end

  describe '#keywords' do
    let(:playlist) { create(:playlist, :with_keywords) }

    it 'gets two keywords as array' do
      expect(playlist.keywords.is_a?(Array)).to eq true
      expect(playlist.keywords.size).to eq 2
    end
  end

  describe '#hashtag=' do
    let(:playlist) { create(:playlist) }
    let(:hashtags) { %w[#hashtag1 #hashtag2] }

    it 'saves hashtags as PlaylistHashtag' do
      expect do
        playlist.hashtags = hashtags
      end.to change(PlaylistHashtag, :count).from(0).to(2)
    end
  end

  describe '#hashtags' do
    let(:playlist) { create(:playlist, :with_hashtags) }

    it 'gets two hashtags as array' do
      expect(playlist.hashtags.is_a?(Array)).to eq true
      expect(playlist.hashtags.size).to eq 2
    end
  end

  describe '#article_contains_episodes' do
    let(:playlist) { build(:playlist, editor_data: editor_data) }

    context 'When editor_data does not present' do
      let(:editor_data) { nil }

      it 'returns empty array' do
        expect(playlist.article_contains_episodes).to eq []
      end
    end

    context 'When editor_data does exist' do
      let(:editor_data) do
        File.open(Rails.root.join('spec/fixtures/payloads/editor-data.json')) do |file|
          json_string = file.read
          JSON.parse(json_string, symbolize_names: true)
        end
      end

      before do
        json =
          File.open(Rails.root.join('spec/fixtures/payloads/l_bundle_te_PG3Z16Q145.json')) do |file|
            json_string = file.read
            JSON.parse(json_string, symbolize_names: true)
          end
        client = instance_double(DlabApiClient)
        allow(DlabApiClient).to receive(:new).and_return(client)
        allow(client).to receive(:episode_l_bundle).with(type: 'tv', episode_id: 'PG3Z16Q145').and_return(json)
      end

      it 'retruns episodes array' do
        expect(playlist.article_contains_episodes.size).to be 1
      end
    end
  end

  describe '#available_article' do
    let(:playlist) { create(:playlist, marked_body: marked_body, active_article: active_article) }
    let(:marked_body) { '' }
    let(:active_article) { true }

    # active_article
    # available_articleは active_articleが1かつ記事本文が1文字以上存在する場合にtrueになること
    context '記事が存在する場合' do
      let(:marked_body) { 'aaa' }

      context 'active_articleが1' do
        let(:active_article) { 1 }

        it 'trueになること' do
          expect(playlist.available_article).to be_truthy
        end
      end

      context 'active_articleが0' do
        let(:active_article) { 0 }

        it 'falseになること' do
          expect(playlist.available_article).to be_falsey
        end
      end
    end

    context '記事が存在しない場合' do
      let(:marked_body) { '' }

      context 'active_articleが1' do
        let(:active_article) { 1 }

        it 'falseになること' do
          expect(playlist.available_article).to be_falsey
        end
      end

      context 'active_articleが0' do
        let(:active_article) { 0 }

        it 'falseになること' do
          expect(playlist.available_article).to be_falsey
        end
      end
    end
  end
end
