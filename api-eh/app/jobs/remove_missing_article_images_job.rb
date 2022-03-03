# frozen_string_literal: true

# プレイリストと関連がない画像を削除する
class RemoveMissingArticleImagesJob < SidekiqBaseJob
  sidekiq_options queue: 'p5'

  MISSING_ARTICLE_IMAGE_TIME_LIMIT = 1.month.ago

  def perform
    super
    ArticleImage.where('created_at < ?', MISSING_ARTICLE_IMAGE_TIME_LIMIT).where(playlist_id: nil).destroy_all
  end
end
