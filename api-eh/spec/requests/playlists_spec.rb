# frozen_string_literal: true

require 'rails_helper'

describe PlaylistsController, type: :request do
  describe 'GET #index' do
    before do
      create(:playlist, name: 'オウサム ネーム')
      create(:playlist, d5_playlist_id: 1)
    end

    let(:deck_r5_with_playlists) { create(:deck, :with_playlists, is_r5: true) }
    let(:expected_json) {
      {
        'stringId' => "recommend-tep-#{format('%010d', deck_r5_with_playlists.playlists[0]['id'])}",
        'primaryId' => deck_r5_with_playlists.playlists[0]['id'],
        'name' => deck_r5_with_playlists.playlists[0]['name'],
        'detailedNameRuby' => deck_r5_with_playlists.playlists[0]['detailed_name_ruby'],
        'description' => deck_r5_with_playlists.playlists[0]['description'],
        'headline' => deck_r5_with_playlists.playlists[0]['headline']
      }
    }

    context 'パラメータにdeck_idが含まれる場合' do
      let(:params) { { deck_id: deck_r5_with_playlists.id } }

      it 'idに紐づくデッキが取得されること' do
        get playlists_url, params: params
        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['playlists'][0]).to include expected_json
      end
    end

    context 'パラメータにareaが含まれる場合' do
      let(:params) { { area: deck_r5_with_playlists.area, is_r5: true } }

      it 'areaに紐づくr5相当のデッキが取得されること' do
        get playlists_url, params: params
        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['playlists'][0]).to include expected_json
      end
    end

    context 'パラメータにdeck_idもareaも含まれない場合' do
      let(:params) { '' }

      it 'r5デッキのプレイリストIDを含まないプレイリストが取得されること' do
        get playlists_url, params: params
        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['playlists'].size).to eq 1
      end
    end

    context 'パラメータにapi_stateが含まれる場合' do
      context 'api_stateがopenの場合' do
        let!(:playlist) { create(:playlist, api_state: 'open') }
        let(:params) { { api_state: 'open' } }

        it '公開ステータスがopenとなること' do
          get playlists_url, params: params
          expect(response.status).to eq 200
          json = JSON.parse(response.body)
          expect(json['playlists'][0]['apiState']).to eq 'open'
        end
      end

      context 'api_stateがcloseの場合' do
        let!(:playlist) { create(:playlist, api_state: 'close') }
        let(:params) { { api_state: 'close' } }

        it '公開ステータスがcloseとなること' do
          get playlists_url, params: params
          expect(response.status).to eq 200
          json = JSON.parse(response.body)
          expect(json['playlists'][0]['apiState']).to eq 'close'
        end
      end
    end

    context '検索ワードが含まれる場合' do
      let(:params) { { search_word: 'オウサム' } }

      it '検索ワードに部分一致するプレイリストが取得できること' do
        get playlists_url, params: params
        expect(response.status).to eq 200
        json = JSON.parse(response.body)
        expect(json['playlists'][0]['name']).to eq 'オウサム ネーム'
      end
    end
  end

  describe 'POST #create' do
    let(:params) { { playlist: { name: 'cool name' } } }
    before { create(:deck) }

    it 'creates new playlist' do
      expect do
        post '/playlists', params: params
      end.to change {
        Playlist.count
      }.from(0).to(1)
    end

    context 'create with article image' do
      let(:article_image) { create(:article_image, :with_image) }
      let(:editor_data) do
        { time: 1_645_163_766_121,
          blocks: [{ type: 'image', data: { file: { url: article_image.image_id } } }],
          version: '2.19.1' }.to_json
      end
      let(:params) { { playlist: { name: 'cool name', editor_data: editor_data } } }

      it 'returns success response' do
        post '/playlists', params: params
        expect(response.status).to eq 200
      end
    end
  end

  describe 'GET #show' do
    let(:playlist) { create(:playlist) }

    it 'succeeds the request' do
      get playlist_path(playlist)
      expect(response.status).to eq 200
    end
  end

  describe 'PUT #update' do
    let!(:playlist) { create(:playlist) }
    let(:name) { 'updated name' }
    let(:params) { { playlist: { name: name } } }

    it 'updates playlist record' do
      put playlist_path(playlist), params: params
      expect(response.status).to eq(200)
      expect(playlist.reload.name).to eq(name)
    end
  end

  describe 'DELETE #delete' do
    let!(:playlist) { create(:playlist) }

    it 'delete playlist' do
      expect do
        delete playlist_path(playlist)
      end.to change {
        Playlist.count
      }.from(1).to(0)
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
      allow_any_instance_of(PlaylistsController).to receive(:image_param).and_return(image)
    end

    it 'リクエストが成功する' do
      post "/playlists/#{playlist.string_uid}/upload_article_image_by_file"
      expect(response.status).to eq 200
      expect(ArticleImage.count).to eq(1)
      expect(JSON.parse(response.body)['success']).to eq 1
    end
  end
end
