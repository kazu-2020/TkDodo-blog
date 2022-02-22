# frozen_string_literal: true

require 'rails_helper'

RSpec.describe MoveImagesJob, type: :model do
  test_image_file_path = Rails.root.join('spec', 'fixtures', 'images', 'test.jpg')
  let(:article_image) { create(:article_image, :with_image) }
  let(:playlist) do
    create(:playlist,
           logo_image: File.open(test_image_file_path),
           eyecatch_image: File.open(test_image_file_path),
           hero_image: File.open(test_image_file_path),
           editor_data: {
             blocks: [
               {
                 data: {
                   file: { url: article_image.image.id },
                   caption: 'caption',
                   stretched: false,
                   withBorder: false,
                   withBackground: false
                 },
                 type: 'image'
               }
             ]
           })
  end

  before do
    playlist.article_images << article_image
  end

  it 'ファイル名が変わっていること' do
    # changeを使うと読みにくいのでシンプルに確認する
    before_logo_image_data = playlist.logo_image_data.dup
    before_eyecatch_image_data = playlist.eyecatch_image_data.dup
    before_hero_image_data = playlist.hero_image_data.dup
    before_article_image_data = article_image.image_data.dup
    before_editor_data = playlist.editor_data.dup

    MoveImagesJob.perform_async

    expect(playlist.reload.logo_image_data).to_not eq before_logo_image_data
    expect(playlist.reload.eyecatch_image_data).to_not eq before_eyecatch_image_data
    expect(playlist.reload.hero_image_data).to_not eq before_hero_image_data
    expect(playlist.reload.editor_data).to_not eq before_article_image_data
    expect(article_image.reload.image_data).to_not eq before_editor_data
  end
end
