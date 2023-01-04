# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LogoUploader, type: :model do
  before do
    poc_client = instance_double(PocApiClient)
    allow(PocApiClient).to receive(:new).and_return(poc_client)
    allow(poc_client).to receive(:playlist_ll_bundle).with(playlist_id: anything).and_return({})
  end

  let(:image) { playlist.logo_image }
  let(:derivatives) { playlist.logo_image_derivatives }
  let(:playlist) { create(:playlist, logo_image: File.open(Rails.root.join('spec', 'fixtures', 'images', 'test.jpg'))) }

  describe '#strip' do
    it do
      playlist.reload
      expect(derivatives[:default]).to be_a(Shrine::UploadedFile)
      expect(derivatives[:small]).to be_a(Shrine::UploadedFile)
      expect(derivatives[:medium]).to be_a(Shrine::UploadedFile)

      # exifが消えてるか確認
      path = File.expand_path("public/uploads/test/private/#{image.id}")
      image = MiniMagick::Image.open(path)
      expect(image.exif).to be_blank
    end
  end
end
