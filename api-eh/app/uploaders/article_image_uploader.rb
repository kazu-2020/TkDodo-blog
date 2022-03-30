# frozen_string_literal: true

require 'image_processing/mini_magick'

class ArticleImageUploader < ImageUploader
  plugin :model, cache: false

  # override
  # 画像を出力するパスを生成する
  #
  # https://github.com/d7lab/dot-editorialhands/issues/43
  #
  # Article Image
  # /playlist/article_images/151253151.gif
  def generate_location(io, **context)
    context = context.deep_symbolize_keys
    ext = file_extension_by(mime_type: context.dig(:metadata, :mime_type))

    "playlist/article_images/#{generate_uid(io)}#{ext}"
  end
end
