# frozen_string_literal: true

# プレイリストと関連がない画像を削除する
class RemoveMissingArticleImagesJob < SidekiqBaseJob
  sidekiq_options queue: 'p5'

  MISSING_ARTICLE_IMAGE_TIME_LIMIT = 1.month.ago

  def perform
    super
    article_images = ArticleImage.where('created_at < ?', MISSING_ARTICLE_IMAGE_TIME_LIMIT).where(playlist_id: nil)
    article_images.each do |article_image|
      article_image.remove_shrine_image = true
      article_image.destroy
    end
  end
end
