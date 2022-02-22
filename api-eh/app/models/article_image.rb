# frozen_string_literal: true

class ArticleImage < ApplicationRecord
  include ArticleImageUploader::Attachment(:image)

  belongs_to :playlist, optional: true

  before_save do
    self.image_id = image.id
  end

  scope :has_playlist, -> { where.not(playlist_id: nil) }
end
