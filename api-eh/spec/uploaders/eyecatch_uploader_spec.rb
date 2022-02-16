# frozen_string_literal: true

require 'rails_helper'

RSpec.describe EyecatchUploader, type: :model do
  let(:image) { playlist.eyecatch_image }
  let(:derivatives) { playlist.eyecatch_image_derivatives }
  let(:playlist) {
    file = File.open(Rails.root.join('spec', 'fixtures', 'images', 'test.jpg'))
    create(:playlist, eyecatch_image: file)
  }

  describe :strip do
    it do
      expect(derivatives[:default]).to be_kind_of(Shrine::UploadedFile)
      expect(derivatives[:small]).to be_kind_of(Shrine::UploadedFile)
      expect(derivatives[:medium]).to be_kind_of(Shrine::UploadedFile)
      expect(derivatives[:large]).to be_kind_of(Shrine::UploadedFile)

      # exifが消えてるか確認
      path = File.expand_path("public/uploads/test/#{image.id}")
      image = MiniMagick::Image.open(path)
      expect(image.exif).to be_blank
    end
  end
end
