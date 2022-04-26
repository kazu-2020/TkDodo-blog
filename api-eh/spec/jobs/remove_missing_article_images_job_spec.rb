# frozen_string_literal: true

require 'rails_helper'

RSpec.describe RemoveMissingArticleImagesJob, type: :model do
  let(:playlist) { create(:playlist) }

  before do
    create(:article_image, :with_image, created_at: 90.days.ago, playlist_id: playlist.id)  # playlist_article_image
    create(:article_image, :with_image, created_at: 90.days.ago, playlist_id: nil)          # old_missing_image
    create(:article_image, :with_image, created_at: Time.now, playlist_id: nil)             # missing_image
  end

  it 'プレイリストと紐づかない古い画像だけ削除されること' do
    expect {
      described_class.perform_async
    }.to change(ArticleImage, :count).from(3).to(2)
  end
end
