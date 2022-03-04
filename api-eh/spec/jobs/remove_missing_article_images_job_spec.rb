# frozen_string_literal: true

require 'rails_helper'

RSpec.describe RemoveMissingArticleImagesJob, type: :model do
  let(:playlist) { create(:playlist) }
  let!(:playlist_article_image) do
    create(:article_image, :with_image, created_at: 90.days.ago, playlist_id: playlist.id)
  end
  let!(:old_missing_image) { create(:article_image, :with_image, created_at: 90.days.ago, playlist_id: nil) }
  let!(:missing_image) { create(:article_image, :with_image, created_at: Time.now, playlist_id: nil) }

  it '古い画像だけ削除されること' do
    expect {
      RemoveMissingArticleImagesJob.perform_async
    }.to change {
      ArticleImage.count
    }.from(3).to(2)
  end
end
