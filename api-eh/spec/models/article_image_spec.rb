# frozen_string_literal: true

require 'rails_helper'

describe 'ArticleImage' do
  include StoredImageHelpers

  describe '#refresh_image_storage' do
    let(:test_image_file_path) { Rails.root.join('spec', 'fixtures', 'images', 'test.jpg') }
    let(:playlist) { create(:playlist, api_state: api_state) }
    let(:article_image) { create(:article_image, playlist: playlist, image: File.open(test_image_file_path)) }

    # NOTE: reloadを入れないと画像のstorageがstoreにならない
    before { article_image.reload }

    context '公開状態の場合' do
      let(:api_state) { :open }

      it do
        expect(article_image).to be_published
        article_image.refresh_image_storage
      end

      it 'public_storeに画像が存在すること' do
        article_image.reload

        expect(exists_public_store?(article_image.image_attacher)).to be_truthy
      end
    end

    context '非公開状態の場合' do
      let(:api_state) { :close }

      it do
        expect(article_image).not_to be_published
        article_image.refresh_image_storage
      end

      it 'public_storeに画像が存在しないこと' do
        article_image.reload

        expect(exists_public_store?(article_image.image_attacher)).to be_falsey
      end
    end
  end
end
