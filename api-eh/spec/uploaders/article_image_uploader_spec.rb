# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ArticleImageUploader, type: :model do
  let(:article_image) {
    create(:article_image, image: File.open(Rails.root.join('spec', 'fixtures', 'images', 'test.jpg')))
  }

  describe :generate_location do
    it do
      uploader = ArticleImageUploader.new('cache')

      location = uploader.generate_location(nil, **make_context(article_image, :image))
      playlist = article_image.playlist
      expect(location).to match %r{^playlist/pl/#{playlist.string_id}/#{playlist.string_id}-article.*\.jpg}
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
