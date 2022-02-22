# frozen_string_literal: true

require 'rails_helper'

describe PlaylistsController, type: :request do
  describe 'GET #index' do
    before { create(:playlist) }

    it 'returns success response' do
      get playlists_url
      expect(response.status).to eq 200
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
