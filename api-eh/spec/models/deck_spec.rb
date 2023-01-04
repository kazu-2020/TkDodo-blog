# frozen_string_literal: true

require 'rails_helper'

describe Deck do
  describe 'before_validation' do
    context 'デフォルト値が定義されていない場合' do
      it 'deck_uidにuuid、mode_of_itemに「tv」、item_of_typeに「TVEpisode」が設定されること' do
        deck_undefined = build(:deck, deck_uid: nil)
        deck_undefined.save
        expect(deck_undefined.deck_uid).not_to be_nil
        expect(deck_undefined.mode_of_item).to eq 'tv'
        expect(deck_undefined.type_of_item).to eq 'TVEpisode'
      end
    end

    context 'デフォルト値が定義されている場合' do
      it 'deck_uidにuuid、mode_of_itemに「tv」、item_of_typeに「TVEpisode」が設定されないこと' do
        deck_undefined = build(:deck, deck_uid: 'test', mode_of_item: 'test_item', type_of_item: 'test_type')
        deck_undefined.save
        expect(deck_undefined.deck_uid).to eq 'test'
        expect(deck_undefined.mode_of_item).to eq 'test_item'
        expect(deck_undefined.type_of_item).to eq 'test_type'
      end
    end
  end

  describe 'before_save' do
    it 'deck_idがnilであること' do
      deck = build(:deck)
      expect(deck.deck_id).to be_nil
    end
  end

  describe 'after_create' do
    let!(:deck) { build(:deck) }

    it 'deck_idが意図したフォーマットで取得されること' do
      expect do
        deck.save
      end.to change {
        deck.deck_id.present?
      }.from(false).to(true)
      expected_format = "#{deck.type_of_deck}-#{deck.mode_of_item}-for-#{deck.interfix}-#{format('%010d', deck.id)}"
      expect(deck.deck_id).to match(expected_format)
    end
  end

  describe '#rebuild_playlists_to' do
    before do
      poc_client = instance_double(PocApiClient)
      allow(PocApiClient).to receive(:new).and_return(poc_client)
      allow(poc_client).to receive(:playlist_ll_bundle).with(playlist_id: anything).and_return({})
    end

    let!(:deck) { create(:deck, :with_playlists) }

    it 'playlistの紐付けが正しく行われること' do
      new_playlist_ids = deck.playlist_ids + create_list(:playlist, 2).pluck(:id)
      string_current_playlist_ids = deck.playlist_ids.map(&:to_s) # 文字列のIDが混ざって不具合を起こしていたので混ぜてみる
      deck.rebuild_playlists_to(new_playlist_ids + string_current_playlist_ids)

      expect(deck.reload.playlist_ids).to match_array(new_playlist_ids)
    end

    it 'playlistが並び替えられていること' do
      current_playlist_ids = deck.playlist_ids
      new_playlist_ids = deck.playlist_ids.reverse
      deck.rebuild_playlists_to(new_playlist_ids)

      expect(deck.reload.playlist_ids).to match_array(current_playlist_ids.reverse)
    end

    context '存在しないplaylist_idが含まれていた場合' do
      it '存在しないplaylistは含まず、playlistの紐付けが正しく行われること' do
        new_playlist_ids = deck.playlist_ids + create_list(:playlist, 2).pluck(:id)
        new_playlist_ids.push('999_999_999')
        deck.rebuild_playlists_to(new_playlist_ids)
        new_playlist_ids.pop

        expect(deck.reload.playlist_ids).to match_array(new_playlist_ids)
      end
    end
  end
end
