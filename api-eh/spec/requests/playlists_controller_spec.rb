# frozen_string_literal: true

require 'rails_helper'

describe PlaylistsController, type: :request do
  before do
    json =
      File.open(Rails.root.join('spec/fixtures/payloads/r6.0_ll_bundle_pl_recommend-tep-0000000052.json')) do |file|
        json_string = file.read
        JSON.parse(json_string, symbolize_names: true)
      end

    poc_client = instance_double(PocApiClient)
    allow(PocApiClient).to receive(:new).and_return(poc_client)
    allow(poc_client).to receive(:playlist_ll_bundle).with(playlist_id: anything).and_return(json)
  end

  describe 'GET #index' do
    before do
      json =
        File.open(Rails.root.join('spec/fixtures/payloads/r6.0_l_tvepisode_pl_recommend-tep-0000000055.json')) do |file|
          json_string = file.read
          JSON.parse(json_string, symbolize_names: true)
        end

      poc_client = instance_double(PocApiClient)
      allow(PocApiClient).to receive(:new).and_return(poc_client)
      allow(poc_client).to receive(:playlist_ll_bundle).with(playlist_id: anything).and_return({})
      allow(poc_client).to receive(:available_episode_from_playlist).with(playlist_id: playlist.string_id)
                                                                    .and_return(json)
    end

    context 'パラメータにdeck_idが含まれる場合' do
      let!(:playlist) { create(:playlist, decks: [deck]) }
      let(:deck) { create(:deck) }
      let(:params) { { deck_id: deck.id } }
      let(:expected_json) {
        {
          'stringId' => playlist.string_id,
          'primaryId' => playlist.id,
          'name' => playlist.name,
          'detailedNameRuby' => playlist.detailed_name_ruby,
          'description' => playlist.description,
          'headline' => playlist.headline
        }
      }

      it '指定したdeck_idのデッキに紐づくプレイリストが取得できること' do
        get playlists_url, params: params

        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['playlists'][0]).to include expected_json
      end
    end

    context 'パラメータにareaが含まれる場合' do
      let!(:playlist) { create(:playlist, decks: [deck]) }
      let(:area) { '130' }
      let(:deck) { create(:deck, area: area) }
      let(:params) { { area: area } }

      it '指定したareaのデッキに紐づくプレイリストが取得できること' do
        get playlists_url, params: params

        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['playlists'][0]['stringId']).to eq playlist.string_id
      end
    end

    context 'パラメータにapi_stateが含まれる場合' do
      context 'api_stateがopenの場合' do
        let(:playlist) { create(:playlist, api_state: 'open') }
        let(:params) { { api_state: 'open' } }

        it '公開ステータスがopenのプレイリストが取得できること' do
          get playlists_url, params: params

          expect(response.status).to eq 200
          json = JSON.parse(response.body)
          expect(json['playlists'][0]['apiState']).to eq 'open'
        end
      end

      context 'api_stateがcloseの場合' do
        let(:playlist) { create(:playlist, api_state: 'close') }
        let(:params) { { api_state: 'close' } }

        it '公開ステータスがcloseのプレイリストが取得できること' do
          get playlists_url, params: params

          expect(response.status).to eq 200
          json = JSON.parse(response.body)
          expect(json['playlists'][0]['apiState']).to eq 'close'
        end
      end
    end

    context '検索ワードが含まれる場合' do
      let(:playlist) { create(:playlist, name: 'オウサム ネーム') }
      let(:params) { { search_word: 'オウサム' } }

      it '検索ワードに部分一致するプレイリストが取得できること' do
        get playlists_url, params: params

        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['playlists'][0]['name']).to eq 'オウサム ネーム'
      end
    end

    context 'with_episode_countが有効の場合' do
      let(:playlist) { create(:playlist, id: 55) }
      let(:params) { { with_episode_count: 1 } }

      it 'エピソード数が取得できること' do
        get playlists_url, params: params

        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['playlists'][0]['playableItemsCount']).to eq 2
      end
    end
  end

  describe 'POST #create' do
    let(:image_data_encoded_to_base64) {
      "data:image/png;base64,#{Base64.strict_encode64(File.open(Rails.root.join('spec', 'fixtures', 'images',
                                                                                'min_test.png').to_s).read)}"
    }
    let(:logo_image) { image_data_encoded_to_base64 }
    let(:eyecatch_image) { image_data_encoded_to_base64 }
    let(:hero_image) { image_data_encoded_to_base64 }
    let(:params) {
      { playlist: { name: 'cool name', logo_image: logo_image, eyecatch_image: eyecatch_image,
                    hero_image: hero_image } }
    }

    before { create(:deck) }

    it 'creates new playlist' do
      expect do
        post '/playlists', params: params
      end.to change(Playlist, :count).from(0).to(1)
    end

    context 'create with article image' do
      let(:article_image) { create(:article_image, :with_image) }
      let(:editor_data) do
        { time: 1_645_163_766_121,
          blocks: [{ type: 'image', data: { file: { url: article_image.image_id } } }],
          version: '2.19.1' }.to_json
      end
      let(:params) {
        { playlist: { name: 'cool name', editor_data: editor_data,
                      logo_image: logo_image, eyecatch_image: eyecatch_image, hero_image: hero_image } }
      }

      it 'returns success response' do
        post '/playlists', params: params

        expect(response.status).to eq 200
      end
    end
  end

  describe 'GET #show' do
    let(:playlist) { create(:playlist, id: 55) }

    it 'succeeds the request' do
      get playlist_path(playlist)

      expect(response.status).to eq 200
    end

    context 'with_episode_countが有効の場合' do
      before do
        json =
          File.open(Rails.root.join(
                      'spec/fixtures/payloads/r6.0_l_tvepisode_pl_recommend-tep-0000000055.json'
                    )) do |file|
            json_string = file.read
            JSON.parse(json_string, symbolize_names: true)
          end

        poc_client = instance_double(PocApiClient)
        allow(PocApiClient).to receive(:new).and_return(poc_client)
        allow(poc_client).to receive(:playlist_ll_bundle).with(playlist_id: anything).and_return({})
        allow(poc_client).to receive(:available_episode_from_playlist).with(playlist_id: playlist.string_id)
                                                                      .and_return(json)
      end

      let(:params) { { with_episode_count: 1 } }

      it 'エピソード数が取得できること' do
        get playlists_url, params: params

        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['playlists'][0]['playableItemsCount']).to eq 2
      end
    end
  end

  describe 'PUT #update' do
    let!(:playlist) { create(:playlist) }

    context '更新' do
      let(:name) { 'updated name' }
      let(:params) { { playlist: { name: name } } }

      it 'updates playlist record' do
        put playlist_path(playlist), params: params

        expect(response.status).to eq(200)
        expect(playlist.reload.name).to eq(name)
      end
    end

    describe '更新通知' do
      describe '更新通知が呼び出されること' do
        before do
          expect_any_instance_of(SnsNotify::Playlist).to receive(:publish) # rubocop: disable RSpec/ExpectInHook
        end

        context 'メタ情報' do
          it '更新' do
            put playlist_path(playlist), params: { playlist: { name: "#{playlist.name} 2" } }
          end
        end

        context 'キーワード' do
          let!(:keyword1) { create(:playlist_keyword, playlist: playlist) }

          it '追加' do
            put playlist_path(playlist),
                params: { playlist: { name: playlist.name, keywords: [keyword1.name, "#{keyword1.name} 2"] } }
          end

          it '削除' do
            put playlist_path(playlist), params: { playlist: { name: playlist.name } }
          end
        end

        context 'ハッシュタグ' do
          let!(:hashtag1) { create(:playlist_hashtag, playlist: playlist) }

          it '追加' do
            put playlist_path(playlist),
                params: { playlist: { name: playlist.name, hashtags: [hashtag1.name, "#{hashtag1.name} 2"] } }
          end

          it '削除' do
            put playlist_path(playlist), params: { playlist: { name: playlist.name } }
          end
        end

        context 'Citation' do
          let!(:citation1) { create(:citation, playlist: playlist) }

          it '追加' do
            put playlist_path(playlist),
                params: { playlist: { name: playlist.name,
                                      citations_attributes: [{ id: citation1.id,
                                                               name: citation1.name,
                                                               url: citation1.url },
                                                             { name: "#{citation1.name} 2",
                                                               url: "#{citation1.url}/2" }] } }
          end

          it '更新' do
            put playlist_path(playlist),
                params: { playlist: { name: playlist.name,
                                      citations_attributes: [{ id: citation1.id, name: "#{citation1.name} 2",
                                                               url: citation1.url }] } }
          end

          it '削除' do
            put playlist_path(playlist),
                params: { playlist: { name: playlist.name, citations_attributes: [{ id: citation1.id, _destroy: 1 }] } }
          end
        end
      end

      describe '更新通知が呼び出されれないこと' do
        before do
          expect_any_instance_of(SnsNotify::Playlist).not_to receive(:publish) # rubocop: disable RSpec/ExpectInHook
        end

        context 'メタ情報' do
          it '変更なし' do
            put playlist_path(playlist), params: { playlist: { name: playlist.name } }
          end
        end

        context 'キーワード' do
          let!(:keyword1) { create(:playlist_keyword, playlist: playlist) }

          it '変更なし' do
            put playlist_path(playlist), params: { playlist: { name: playlist.name, keywords: [keyword1.name] } }
          end
        end

        context 'ハッシュタグ' do
          let!(:hashtag1) { create(:playlist_hashtag, playlist: playlist) }

          it '変更なし' do
            put playlist_path(playlist), params: { playlist: { name: playlist.name, hashtags: [hashtag1.name] } }
          end
        end

        context 'Citation' do
          let!(:citation1) { create(:citation, playlist: playlist) }

          it '変更なし' do
            put playlist_path(playlist),
                params: { playlist: { name: playlist.name,
                                      citations_attributes: [{ id: citation1.id, name: citation1.name,
                                                               url: citation1.url }] } }
          end
        end
      end
    end
  end

  describe 'DELETE #delete' do
    let!(:playlist) { create(:playlist) }

    it 'delete playlist' do
      expect do
        delete playlist_path(playlist)
      end.to change(Playlist, :count).from(1).to(0)
    end
  end

  describe 'POST #upload_article_image_by_url' do
    let(:playlist) { create(:playlist) }
    let(:params) { { url: 'https://placehold.jp/150x150.png' } }

    it 'リクエストが成功する' do
      post "/playlists/#{playlist.string_uid}/upload_article_image_by_url", params: params

      expect(response.status).to eq 200
      expect(ArticleImage.count).to eq(1)
      expect(JSON.parse(response.body)['success']).to eq 1
    end
  end

  describe 'POST #upload_article_image_by_file' do
    let(:playlist) { create(:playlist) }
    let(:image) do
      fixture_file_upload(Rails.root.join('spec/fixtures/images/square.png'), 'image/png')
    end

    before do
      allow_any_instance_of(described_class).to receive(:image_param).and_return(image)
    end

    it 'リクエストが成功する' do
      post "/playlists/#{playlist.string_uid}/upload_article_image_by_file"
      expect(response.status).to eq 200
      expect(ArticleImage.count).to eq(1)
      expect(JSON.parse(response.body)['success']).to eq 1
    end
  end

  describe 'GET #bundle_items' do
    let!(:playlist) { create(:playlist, id: playlist_id) }
    let(:playlist_id) { 52 }
    let(:playlist_string_id) { 'recommend-tep-0000000052' } # 20220801時点で各エピソードタイプを含むプレイリスト
    let(:expected_json) do
      {
        'eventCount' => 9,
        'faqpageCount' => 2,
        'howtoCount' => 7,
        'tvepisodeCount' => 9,
        'recipeCount' => 9
      }
    end

    it '各Subtypeのカウントが取得できること' do
      VCR.use_cassette('requests/playlists_spec/bundle_items') do
        get bundle_items_playlist_path(playlist.string_uid)
        expect(response.status).to eq 200
        expect(JSON.parse(response.body)).to eq expected_json
      end
    end
  end
end
