# frozen_string_literal: true

require 'spec_helper'

RSpec.describe LogoUploader, type: :model do
  let(:image) { playlist.logo_image }
  let(:derivatives) { playlist.logo_image_derivatives }
  let(:playlist) { create(:playlist, logo_image: File.open(Jets.root.join('spec', 'fixtures', 'images', 'test.jpg'))) }

  it do
    expect(derivatives[:default]).to be_kind_of(Shrine::UploadedFile)
    expect(derivatives[:small]).to be_kind_of(Shrine::UploadedFile)
    expect(derivatives[:medium]).to be_kind_of(Shrine::UploadedFile)

    # exifが消えてるか確認
    path = File.expand_path("public/uploads/test/#{image.id}")
    image = MiniMagick::Image.open(path)
    expect(image.exif).to be_blank
  end
end
