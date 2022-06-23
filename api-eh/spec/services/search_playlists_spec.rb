# frozen_string_literal: true

# rubocop: disable RSpec/VariableName

require 'rails_helper'

describe SearchPlaylists, type: :model do
  describe '#merged_params' do
    let!(:search_playlists) { described_class.new }
    let!(:default_offset) { 0 }
    let!(:default_size) { 10 }
    let!(:default_type) { 'nplaylist' }
    let!(:default_sort_order) { 'desc' }
    let!(:default_sort_order_by) { 'score' }
    let!(:default_type_of_list) { 'recommend' }
    let!(:default_mode_of_item) { 'tv' }
    let!(:default_publish_level) { 'notyet,ready,full,limited,gone' }
    let!(:default_is_fuzzy) { true }
    let!(:search_params) {
      { type: type, offset: offset, mode_of_item: mode_of_item,
        type_of_list: type_of_list, order: order, order_by: order_by,
        size: size, word: word, keyword: keyword, concern: concern, vService: vService
      }
    }

    context 'search_paramsに値が設定されている場合' do
      subject { search_playlists.send(:convert_to_search_query, search_params) }

      let(:type) { 'nplaylist' }
      let(:offset) { 9999 }
      let(:mode_of_item) { 'test' }
      let(:type_of_list) { 'test' }
      let(:order) { 'desc' }
      let(:order_by) { 'dateModified' }
      let(:size) { 1 }
      let(:word) { 'test' }
      let(:keyword) { 'test' }
      let(:concern) { 'test' }
      let(:vService) { 't1,e2,s3,t4' }
      let(:expected_result_hash) {
        { type: type, offset: offset, modeOfItem: mode_of_item, isFuzzy: default_is_fuzzy,
          typeOfList: type_of_list, order: order, orderBy: order_by, size: size, word: word,
          keyword: keyword, concern: concern, vService: vService, publishLevel:default_publish_level
        }
      }

      it 'search_paramsの値が格納されたHashが返ること' do
        expect(subject).to eq expected_result_hash
      end
    end

    context 'search_paramsが空の場合' do
      subject { search_playlists.send(:convert_to_search_query, search_params) }

      let(:type) { nil }
      let(:offset) { nil }
      let(:mode_of_item) { nil }
      let(:type_of_list) { nil }
      let(:order) { nil }
      let(:order_by) { nil }
      let(:size) { nil }
      let(:word) { nil }
      let(:keyword) { nil }
      let(:concern) { nil }
      let(:vService) { nil }
      let(:expected_result_hash) {
        { type: default_type, offset: default_offset, modeOfItem: default_mode_of_item, isFuzzy: true,
          typeOfList: default_type_of_list, order: default_sort_order, orderBy: default_sort_order_by,
          size: default_size, publishLevel: "notyet,ready,full,limited,gone",
        }
      }

      it '既定値が格納されたHashが返ること' do
        # 既定値が存在しない場合はHashに含めない
        expect(subject).to eq expected_result_hash
        expect(subject).not_to include(:word, :keyword, :concern, :vService)
      end
    end
  end
end
# rubocop: enable RSpec/VariableName
