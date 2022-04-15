# frozen_string_literal: true

require 'rails_helper'

describe Deck, type: :model do
  describe 'before_validation' do
    context 'deck_uidがblankの場合' do
      it 'deck_uidにランダムな値が代入されること'
    end
    context 'アイテムモードが未定義の場合' do
      it 'アイテムモードが「tv」となること'
    end
    context 'アイテムタイプが未定義の場合' do
      it 'アイテムタイプが「TVEpisode」となること'
    end
  end

  describe 'before_save' do
    it 'deck_idが取得されないこと'
  end

  context 'after_create' do
    it 'deck_idが取得されること'
  end

  context 'total_time' do
    it 'do nothing'
  end
end
