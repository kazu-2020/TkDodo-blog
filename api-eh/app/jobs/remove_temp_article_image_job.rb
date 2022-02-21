# frozen_string_literal: true

# 利用されていない記事の画像を削除する
class RemoveTempArticleImageJob < SidekiqBaseJob
  sidekiq_options queue: 'p7'

  def perform(playlist_id)
    super
    @playlist = Playlist.find(playlist_id)
    trash_images.each(&:destroy!)
  end

  private

  # editor_dataに保存されていない画像
  def trash_images
    @playlist.article_images.reject do |img|
      permanent_image_urls.blank? || img.image&.id.in?(permanent_image_urls)
    end
  end

  # editor_dataに保存されている画像のurl
  def permanent_image_urls
    return [] if @playlist.editor_data.blank?

    @playlist.editor_data['blocks'].map { |b| b['data'].dig('file', 'url') }.compact
  end
end
