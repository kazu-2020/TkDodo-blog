# frozen_string_literal: true

require 'rails_helper'

describe Deck, type: :model do
  describe 'before_validation' do
    context 'デフォルト値が定義されていない場合' do
      it 'deck_uidにuuid、mode_of_itemに「tv」、item_of_typeに「TVEpisode」が設定されること' do
        deck_undefined = build(:deck, deck_uid: nil)
        deck_undefined.save
        expect(deck_undefined.deck_uid).not_to eq nil
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
    let!(:deck) { build :deck }

    it 'deck_idが意図したフォーマットで取得されること' do
      expected_format = "#{deck.type_of_deck}-#{deck.mode_of_item}-for-#{deck.interfix}-#{format('%010d', deck.id)}"
      expect do
        deck.save
      end.to change {
        deck.deck_id.present?
      }.from(false).to(true)
      expect(deck.deck_id).to match(expected_format)
    end
  end
end
