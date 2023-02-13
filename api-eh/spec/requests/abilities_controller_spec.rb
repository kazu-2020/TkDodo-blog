# frozen_string_literal: true

require 'rails_helper'

describe AbilitiesController do
  describe 'GET #index' do
    describe 'システムロール' do
      context 'システム管理者' do
        before do
          user = create(:user, :super_admin)
          allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
          allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)

          get abilities_url
        end

        it do
          json = JSON.parse(response.body)
          expect(json.dig('abilities', 'rules')[0]['actions']).to eq ['manage']
          expect(json.dig('abilities', 'rules')[0]['subjects']).to eq ['all']
          expect(json.dig('abilities', 'rules')[0]['conditions']).to eq({})
        end
      end

      context 'ユーザー管理者' do
        before do
          user = create(:user, :user_admin)
          allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
          allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)

          get abilities_url
        end

        it do
          json = JSON.parse(response.body)
          expect(json.dig('abilities', 'rules')[0]['actions']).to eq ['manage']
          expect(json.dig('abilities', 'rules')[0]['subjects']).to eq ['User']
          expect(json.dig('abilities', 'rules')[0]['conditions']).to eq({})
        end
      end

      context 'プレイリスト管理者' do
        before do
          user = create(:user, :playlist_admin)
          allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
          allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)

          get abilities_url
        end

        it do
          json = JSON.parse(response.body)

          expect(json.dig('abilities', 'rules')[0]['actions']).to eq ['manage']
          expect(json.dig('abilities', 'rules')[0]['subjects']).to eq ['Playlist']
          expect(json.dig('abilities', 'rules')[0]['conditions']).to eq({})

          expect(json.dig('abilities', 'rules')[1]['actions']).to eq ['manage']
          expect(json.dig('abilities', 'rules')[1]['subjects']).to eq ['PlaylistItem']
          expect(json.dig('abilities', 'rules')[1]['conditions']).to eq({})

          expect(json.dig('abilities', 'rules')[2]['actions']).to eq ['manage']
          expect(json.dig('abilities', 'rules')[2]['subjects']).to eq ['Episode']
          expect(json.dig('abilities', 'rules')[2]['conditions']).to eq({})
        end
      end

      context 'デッキ管理者' do
        before do
          user = create(:user, :deck_admin)
          allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
          allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)

          get abilities_url
        end

        it do
          json = JSON.parse(response.body)

          expect(json.dig('abilities', 'rules')[0]['actions']).to eq ['manage']
          expect(json.dig('abilities', 'rules')[0]['subjects']).to eq ['Deck']
          expect(json.dig('abilities', 'rules')[0]['conditions']).to eq({})

          expect(json.dig('abilities', 'rules')[1]['actions']).to eq ['manage']
          expect(json.dig('abilities', 'rules')[1]['subjects']).to eq ['SeriesDeck']
          expect(json.dig('abilities', 'rules')[1]['conditions']).to eq({})

          expect(json.dig('abilities', 'rules')[2]['actions']).to eq %w[episodes search]
          expect(json.dig('abilities', 'rules')[2]['subjects']).to eq ['SeriesPlaylist']
          expect(json.dig('abilities', 'rules')[2]['conditions']).to eq({})
        end
      end

      context '閲覧者' do
        before do
          user = create(:user, :reader_user)
          allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
          allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)

          get abilities_url
        end

        it do
          json = JSON.parse(response.body)

          p json

          expect(json.dig('abilities', 'rules')[0]['actions']).to eq %w[read actors_and_contributors bundle_items]
          expect(json.dig('abilities', 'rules')[0]['subjects']).to eq ['Playlist']
          expect(json.dig('abilities', 'rules')[0]['conditions']).to eq({})

          expect(json.dig('abilities', 'rules')[1]['actions']).to eq ['read']
          expect(json.dig('abilities', 'rules')[1]['subjects']).to eq ['PlaylistItem']
          expect(json.dig('abilities', 'rules')[1]['conditions']).to eq({})

          expect(json.dig('abilities', 'rules')[2]['actions']).to eq ['read']
          expect(json.dig('abilities', 'rules')[2]['subjects']).to eq ['Deck']
          expect(json.dig('abilities', 'rules')[2]['conditions']).to eq({})

          expect(json.dig('abilities', 'rules')[3]['actions']).to eq ['read']
          expect(json.dig('abilities', 'rules')[3]['subjects']).to eq ['SeriesDeck']
          expect(json.dig('abilities', 'rules')[3]['conditions']).to eq({})

          expect(json.dig('abilities', 'rules')[4]['actions']).to eq ['episodes']
          expect(json.dig('abilities', 'rules')[4]['subjects']).to eq ['SeriesPlaylist']
          expect(json.dig('abilities', 'rules')[4]['conditions']).to eq({})

          expect(json.dig('abilities', 'rules')[5]['actions']).to eq ['bundle']
          expect(json.dig('abilities', 'rules')[5]['subjects']).to eq ['Episode']
          expect(json.dig('abilities', 'rules')[5]['conditions']).to eq({})
        end
      end
    end

    describe 'レコメンドプレイリストロール' do
      let(:playlist) { create(:playlist, :with_playlist_items) }
      let(:reader_actions) { %w[read] }
      let(:user) { create(:user, :super_admin) }

      before do
        poc_client = instance_double(PocApiClient)
        allow(PocApiClient).to receive(:new).and_return(poc_client)
        allow(poc_client).to receive(:playlist_ll_bundle).with(playlist_id: anything).and_return({})

        allow_any_instance_of(Secured).to receive(:authenticate_request!).and_return(user)
        allow_any_instance_of(ApiBaseController).to receive(:current_user).and_return(user)
      end

      context '代表承認者' do
        before do
          user.add_role(:manager, playlist)
          user.add_role(:manager, playlist.playlist_items.first)

          get abilities_url
        end

        let(:manager_actions) {
          %w[read update destroy assign publish bulk_update upload_article_image_by_url upload_article_image_by_file
             actors_and_contributors bundle_items]
        }

        it do
          json = JSON.parse(response.body)

          expect(json.dig('abilities', 'rules')[0]['actions']).to eq ['manage']
          expect(json.dig('abilities', 'rules')[0]['subjects']).to eq ['all']
          expect(json.dig('abilities', 'rules')[0]['conditions']).to eq({})

          expect(json.dig('abilities', 'rules')[1]['actions']).to eq manager_actions
          expect(json.dig('abilities', 'rules')[1]['subjects']).to eq ['Playlist']

          expect(json.dig('abilities', 'rules')[2]['actions']).to eq manager_actions
          expect(json.dig('abilities', 'rules')[2]['subjects']).to eq ['PlaylistItem']
        end
      end

      context '承認者' do
        let(:approver_actions) {
          %w[read update publish bulk_update upload_article_image_by_url upload_article_image_by_file
             actors_and_contributors bundle_items]
        }

        before do
          user.add_role(:approver, playlist)
          user.add_role(:approver, playlist.playlist_items.first)

          get abilities_url
        end

        it do
          json = JSON.parse(response.body)

          expect(json.dig('abilities', 'rules')[1]['actions']).to eq approver_actions
          expect(json.dig('abilities', 'rules')[1]['subjects']).to eq ['Playlist']

          expect(json.dig('abilities', 'rules')[2]['actions']).to eq approver_actions
          expect(json.dig('abilities', 'rules')[2]['subjects']).to eq ['PlaylistItem']
        end
      end

      context '入力者' do
        before do
          user.add_role(:editor, playlist)
          user.add_role(:editor, playlist.playlist_items.first)

          get abilities_url
        end

        let(:editor_actions) {
          %w[read update bulk_update upload_article_image_by_url upload_article_image_by_file actors_and_contributors
             bundle_items]
        }

        it do
          json = JSON.parse(response.body)

          expect(json.dig('abilities', 'rules')[1]['actions']).to eq editor_actions
          expect(json.dig('abilities', 'rules')[1]['subjects']).to eq ['Playlist']

          expect(json.dig('abilities', 'rules')[2]['actions']).to eq editor_actions
          expect(json.dig('abilities', 'rules')[2]['subjects']).to eq ['PlaylistItem']
        end
      end

      context '閲覧者' do
        before do
          user.add_role(:reader, playlist)
          user.add_role(:reader, playlist.playlist_items.first)

          get abilities_url
        end

        let(:reader_actions) { %w[read actors_and_contributors bundle_items] }

        it do
          json = JSON.parse(response.body)

          expect(json.dig('abilities', 'rules')[1]['actions']).to eq reader_actions
          expect(json.dig('abilities', 'rules')[1]['subjects']).to eq ['Playlist']

          expect(json.dig('abilities', 'rules')[2]['actions']).to eq reader_actions
          expect(json.dig('abilities', 'rules')[2]['subjects']).to eq ['PlaylistItem']
        end
      end
    end
  end
end
