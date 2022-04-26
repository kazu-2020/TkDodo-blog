# frozen_string_literal: true

require 'rails_helper'

RSpec.describe RemoveMissingArticleImagesJob, type: :model do
  it '古い画像だけ削除されること' do
    create(:article_image, :with_image, created_at: 90.days.ago, playlist_id: nil)
    create(:article_image, :with_image, created_at: Time.now, playlist_id: nil)
    expect {
      described_class.perform_async
    }.to change(ArticleImage, :count).from(2).to(1)
  end
end
