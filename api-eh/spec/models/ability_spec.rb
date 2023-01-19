# frozen_string_literal: true

require 'rails_helper'

describe 'Ability' do
  describe '#initialize' do
    describe 'システムロール' do
      context 'super_adminの場合' do
        let(:user) { create(:user, :super_admin) }
        let(:ability) { Ability.new(user) }

        it 'can manage all subjects' do
          expect(ability).to be_can(:manage, :all)
        end
      end

      context 'user_adminの場合' do
        let(:user) { create(:user, :user_admin) }
        let(:ability) { Ability.new(user) }

        it 'can manage User' do
          expect(ability).to be_can(:manage, User)
        end

        it 'can manage Announcement' do
          expect(ability).to be_can(:manage, Announcement)
        end
      end

      context 'playlist_adminの場合' do
        let(:user) { create(:user, :playlist_admin) }
        let(:ability) { Ability.new(user) }

        it 'can manage Playlist' do
          expect(ability).to be_can(:manage, Playlist)
        end

        it 'can read PlaylistItem' do
          expect(ability).to be_can(:manage, PlaylistItem)
        end

        it 'can manage Episode' do
          expect(ability).to be_can(:manage, 'Episode')
        end

        it 'can manage Announcement' do
          expect(ability).to be_can(:manage, Announcement)
        end
      end

      context 'deck_adminの場合' do
        let(:user) { create(:user, :deck_admin) }
        let(:ability) { Ability.new(user) }

        it 'can manage Deck' do
          expect(ability).to be_can(:manage, Deck)
        end

        it 'can manage SeriesDeck' do
          expect(ability).to be_can(:manage, SeriesDeck)
        end

        it 'can episodes SeriesPlaylist' do
          actions = %i[episodes search]

          actions.each do |action|
            expect(ability).to be_can(action, SeriesPlaylist)
          end
        end

        it 'can manage Announcement' do
          expect(ability).to be_can(:manage, Announcement)
        end
      end

      context 'reader_userの場合' do
        let(:user) { create(:user, :reader_user) }
        let(:ability) { Ability.new(user) }

        it 'can read Playlist' do
          actions = %i[read actors_and_contributors bundle_items]

          actions.each do |action|
            expect(ability).to be_can(action, Playlist)
          end
        end

        it 'can read PlaylistItem' do
          expect(ability).to be_can(:read, PlaylistItem)
        end

        it 'can read Deck' do
          expect(ability).to be_can(:read, Deck)
        end

        it 'can read SeriesDeck' do
          expect(ability).to be_can(:read, SeriesDeck)
        end

        it 'can episodes SeriesPlaylist' do
          expect(ability).to be_can(:episodes, SeriesPlaylist)
        end

        it 'can bundle Episode' do
          expect(ability).to be_can(:bundle, 'Episode')
        end

        it 'can read Announcement' do
          expect(ability).to be_can(:read, Announcement)
        end
      end

      context 'user_admin かつ playlist_adminの場合' do
        let(:user) { create(:user, :user_admin, :playlist_admin) }
        let(:ability) { Ability.new(user) }

        it 'can manage User' do
          expect(ability).to be_can(:manage, User)
        end

        it 'can manage Playlist' do
          expect(ability).to be_can(:manage, Playlist)
        end

        it 'can read PlaylistItem' do
          expect(ability).to be_can(:manage, PlaylistItem)
        end

        it 'can manage Episode' do
          expect(ability).to be_can(:manage, 'Episode')
        end

        it 'can manage Announcement' do
          expect(ability).to be_can(:manage, Announcement)
        end
      end

      context 'user_admin かつ deck_adminの場合' do
        let(:user) { create(:user, :user_admin, :deck_admin) }
        let(:ability) { Ability.new(user) }

        it 'can manage User' do
          expect(ability).to be_can(:manage, User)
        end

        it 'can manage Deck' do
          expect(ability).to be_can(:manage, Deck)
        end

        it 'can manage SeriesDeck' do
          expect(ability).to be_can(:manage, SeriesDeck)
        end

        it 'can episodes SeriesPlaylist' do
          actions = %i[episodes search]

          actions.each do |action|
            expect(ability).to be_can(action, SeriesPlaylist)
          end
        end

        it 'can manage Announcement' do
          expect(ability).to be_can(:manage, Announcement)
        end
      end
    end

    describe 'レコメンドプレイリストロール' do
      before do
        poc_client = instance_double(PocApiClient)
        allow(PocApiClient).to receive(:new).and_return(poc_client)
        allow(poc_client).to receive(:playlist_ll_bundle).with(playlist_id: anything).and_return({})
      end

      context '代表承認者の場合' do
        let(:user) { create(:user, :user_admin) }
        let(:playlist) { create(:playlist, :with_playlist_item) }
        let(:ability) { Ability.new(user) }

        before do
          user.add_role(:manager, playlist)
          user.add_role(:manager, playlist.playlist_items.first)
        end

        it do
          actions = %i[read update destroy assign publish bulk_update]

          actions.each do |action|
            expect(ability).to be_can(action, Playlist)
            expect(ability).to be_can(action, PlaylistItem)
          end
        end
      end

      context '承認者の場合' do
        let(:user) { create(:user, :user_admin) }
        let(:playlist) { create(:playlist, :with_playlist_item) }
        let(:ability) { Ability.new(user) }

        before do
          user.add_role(:approver, playlist)
          user.add_role(:approver, playlist.playlist_items.first)
        end

        it do
          actions = %i[read update publish bulk_update]

          actions.each do |action|
            expect(ability).to be_can(action, Playlist)
            expect(ability).to be_can(action, PlaylistItem)
          end
        end
      end

      context '入力者の場合' do
        let(:user) { create(:user, :user_admin) }
        let(:playlist) { create(:playlist, :with_playlist_item) }
        let(:ability) { Ability.new(user) }

        before do
          user.add_role(:editor, playlist)
          user.add_role(:editor, playlist.playlist_items.first)
        end

        it do
          actions = %i[read update bulk_update]

          actions.each do |action|
            expect(ability).to be_can(action, Playlist)
            expect(ability).to be_can(action, PlaylistItem)
          end
        end
      end

      context '閲覧者の場合' do
        let(:user) { create(:user, :user_admin) }
        let(:playlist) { create(:playlist, :with_playlist_item) }
        let(:ability) { Ability.new(user) }

        before do
          user.add_role(:reader, playlist)
          user.add_role(:reader, playlist.playlist_items.first)
        end

        it do
          actions = %i[read]

          actions.each do |action|
            expect(ability).to be_can(action, Playlist)
            expect(ability).to be_can(action, PlaylistItem)
          end
        end
      end
    end
  end
end
