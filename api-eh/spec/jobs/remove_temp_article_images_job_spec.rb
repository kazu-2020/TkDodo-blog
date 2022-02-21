# frozen_string_literal: true

require 'rails_helper'

RSpec.describe RemoveTempArticleImageJob, type: :model do
  let!(:permanent_image) { create(:article_image, :with_image) }
  let!(:temporary_image) { create(:article_image, :with_image) }
  let(:playlist) do
    create(:playlist, editor_data: {
             time: 1_599_203_453_964,
             blocks: [
               {
                 data: {
                   file: { url: permanent_image.image.id },
                   caption: 'caption',
                   stretched: false,
                   withBorder: false,
                   withBackground: false
                 },
                 type: 'image'
               }
             ],
             version: '2.19.1'
           })
  end

  # playlistのeditor_dataにない画像のレコードを作成して、あるものが残って、ないものが消えることを確認する
  before do
    playlist.article_images << [permanent_image, temporary_image]
    RemoveTempArticleImageJob.perform_async(playlist.id)
  end

  it '一時的の保存された画像レコードが削除されること' do
    expect(playlist.article_images.where(id: temporary_image.id)).to be_blank
    expect(playlist.article_images.where(id: permanent_image.id)).to_not be_blank
  end
end
