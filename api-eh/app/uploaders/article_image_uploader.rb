# frozen_string_literal: true

require 'image_processing/mini_magick'

class ArticleImageUploader < ImageUploader
  # override
  # 画像を出力するパスを生成する
  #
  # https://github.com/d7lab/dot-editorialhands/issues/43
  #
  # Article Image
  # /playlist/pl/recommend-tep-0000000001/recommend-tep-0000000001-article_151253151.gif
  def generate_location(io, **context)
    context = context.deep_symbolize_keys
    record = context.fetch(:record)
    playlist_id = record.playlist.string_id

    ext = File.extname(context.dig(:metadata, :filename)).downcase
    ext = '.jpg' if ext == '.jpeg' # jpegとjpgを統一

    "playlist/pl/#{playlist_id}/#{playlist_id}-article_#{generate_uid(io)}#{ext}"
  end
end
