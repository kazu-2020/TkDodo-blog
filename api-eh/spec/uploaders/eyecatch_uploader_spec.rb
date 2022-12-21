# frozen_string_literal: true

require 'rails_helper'

RSpec.describe EyecatchUploader, type: :model do
  before do
    poc_client = instance_double(PocApiClient)
    allow(PocApiClient).to receive(:new).and_return(poc_client)
    allow(poc_client).to receive(:playlist_ll_bundle).with(playlist_id: anything).and_return({})
  end

  let(:image) { playlist.eyecatch_image }
  let(:derivatives) { playlist.eyecatch_image_derivatives }
  let(:playlist) {
    file = File.open(Rails.root.join('spec', 'fixtures', 'images', 'test.jpg'))
    create(:playlist, eyecatch_image: file)
  }

  describe '#strip' do
    it do
      playlist.reload
      expect(derivatives[:default]).to be_a(Shrine::UploadedFile)
      expect(derivatives[:small]).to be_a(Shrine::UploadedFile)
      expect(derivatives[:medium]).to be_a(Shrine::UploadedFile)
      expect(derivatives[:large]).to be_a(Shrine::UploadedFile)

      # exifが消えてるか確認
      path = File.expand_path("public/uploads/test/private/#{image.id}")
      image = MiniMagick::Image.open(path)
      expect(image.exif).to be_blank
    end
  end
end
