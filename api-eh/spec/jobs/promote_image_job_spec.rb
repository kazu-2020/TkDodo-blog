# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PromoteImageJob, type: :model do
  include StoredImageHelpers

  describe '画像の公開状況を確認' do
    test_image_file_path = Rails.root.join('spec', 'fixtures', 'images', 'test.jpg')

    # 画像付きレコードを保存するとPromoteImageJobが実行される
    let(:playlist) do
      create(:playlist,
             logo_image: File.open(test_image_file_path),
             eyecatch_image: File.open(test_image_file_path),
             hero_image: File.open(test_image_file_path))
    end
    before do
      # NOTE: reloadを入れないと画像のstorageがstoreにならない
      playlist.reload
    end

    it 'public_storeに画像が存在すること' do
      expect(exists_public_store?(playlist.logo_image_attacher)).to be_truthy
      expect(exists_public_store?(playlist.eyecatch_image_attacher)).to be_truthy
      expect(exists_public_store?(playlist.hero_image_attacher)).to be_truthy
    end
  end
end
