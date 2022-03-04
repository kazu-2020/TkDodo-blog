# frozen_string_literal: true

class ArticleImage < ApplicationRecord
  include ArticleImageUploader::Attachment(:image)

  belongs_to :playlist, optional: true

  before_save do
    self.image_id = image.id
  end

  scope :has_playlist, -> { where.not(playlist_id: nil) }

  # この属性を true にすると、shrine の画像も同時に消せる
  attribute :remove_shrine_image, :boolean, default: false
end
