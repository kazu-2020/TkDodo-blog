# frozen_string_literal: true

require 'rails_helper'

describe Deck, type: :model do
  describe 'before_validation' do
    context 'deck_uidがblankの場合' do
      it 'deck_uidに値が代入されること' do
        deck_without = build(:deck, deck_uid: nil)
        deck_without.save
        expect(deck_without.deck_uid).not_to eq nil
      end
    end

    context 'deck_uidがblankではない場合' do
      it 'deck_uidが「test」となること' do
        deck_without = build(:deck, deck_uid: 'test')
        expect(deck_without.deck_uid).to eq 'test'
      end
    end

    context 'アイテムモードが未定義の場合' do
      it 'アイテムモードが「tv」となること' do
        deck_undefined = Deck.new
        expect(deck_undefined.mode_of_item).to eq 'tv'
      end
    end

    context 'アイテムモードが定義されている場合' do
      it 'アイテムモードが「test」となること' do
        deck_undefined = Deck.new(mode_of_item: 'test')
        expect(deck_undefined.mode_of_item).to eq 'test'
      end
    end

    context 'アイテムタイプが未定義の場合' do
      it 'アイテムタイプが「TVEpisode」となること' do
        deck_undefined = Deck.new
        expect(deck_undefined.type_of_item).to eq 'TVEpisode'
      end
    end

    context 'アイテムタイプが定義されている場合' do
      it 'アイテムタイプが「test」となること' do
        deck_undefined = Deck.new(type_of_item: 'test')
        expect(deck_undefined.type_of_item).to eq 'test'
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
    it 'deck_idが取得されること' do
      deck = build(:deck)
      expect do
        deck.save
      end.to change {
        deck.deck_id.present?
      }.from(false).to(true)
    end
  end
end
