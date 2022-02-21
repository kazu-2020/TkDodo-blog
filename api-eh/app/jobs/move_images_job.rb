# frozen_string_literal: true

class MoveImagesJob < SidekiqBaseJob
  sidekiq_options queue: 'p1'

  def perform
    move_playlist_images
    move_article_images
  end

  private

  def move_playlist_images
    Playlist.find_each do |pl|
      logo_image_attacher = pl.logo_image_attacher
      move_file(logo_image_attacher) if logo_image_attacher.stored?

      eyecatch_image_attacher = pl.eyecatch_image_attacher
      move_file(eyecatch_image_attacher) if eyecatch_image_attacher.stored?

      hero_image_attacher = pl.hero_image_attacher
      move_file(hero_image_attacher) if hero_image_attacher.stored?
    end
  end

  def move_article_images # rubocop:disable Metrics/AbcSize
    ArticleImage.find_each do |img|
      image_attacher = img.image_attacher
      next unless image_attacher.stored?

      old_image_id = img.image_id
      move_file(image_attacher)
      new_image_id = img.reload.image_id

      # pl.editor_dataの画像のファイルパスを新しいarticle_image.image.idで更新する
      img.playlist.editor_blocks_of('image').each do |block|
        next unless block['data']['file']['url'] == old_image_id

        block['data']['file']['url'] = new_image_id
      end
      img.playlist.save!
    end
  end

  def move_file(attacher)
    old_attacher = attacher.dup
    current_file = old_attacher.file

    attacher.set attacher.upload(attacher.file)
    attacher.set_derivatives attacher.upload_derivatives(attacher.derivatives)

    attacher.atomic_persist(current_file)
    old_attacher.destroy_attached
  rescue Shrine::AttachmentChanged
    attacher&.destroy_attached
  end
end
