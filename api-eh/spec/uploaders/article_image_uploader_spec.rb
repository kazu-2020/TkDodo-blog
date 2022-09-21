# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ArticleImageUploader, type: :model do
  before do
    poc_client = instance_double(PocApiClient)
    allow(PocApiClient).to receive(:new).and_return(poc_client)
    allow(poc_client).to receive(:playlist_ll_bundle).with(playlist_id: anything).and_return({})
  end

  let(:article_image) {
    create(:article_image, image: File.open(Rails.root.join('spec', 'fixtures', 'images', 'test.jpg')))
  }

  describe '#generate_location' do
    it do
      uploader = described_class.new('cache')

      location = uploader.generate_location(nil, **make_context(article_image, :image))
      expect(location).to match %r{^playlist/article_images/.*\.jpg}
    end

    def make_context(record, name)
      {
        record: record,
        name: name,
        action: :cache,
        phase: :cache,
        metadata: { filename: 'images.jpg', size: 10_256, mime_type: 'image/jpeg', width: 259, height: 194 }
      }
    end
  end
end
