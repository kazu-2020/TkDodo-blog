# frozen_string_literal: true

require 'rails_helper'

RSpec.describe HeroUploader, type: :model do
  let(:image) { playlist.hero_image }
  let(:derivatives) { playlist.hero_image_derivatives }
  let(:playlist) { create(:playlist, hero_image: File.open(Rails.root.join('spec', 'fixtures', 'images', 'test.jpg'))) }

  describe :strip do
    it do
      playlist.reload
      expect(derivatives[:default]).to be_kind_of(Shrine::UploadedFile)
      expect(derivatives[:medium]).to be_kind_of(Shrine::UploadedFile)

      # exifが消えてるか確認
      path = File.expand_path("public/uploads/test/private/#{image.id}")
      image = MiniMagick::Image.open(path)
      expect(image.exif).to be_blank
    end
  end
end
