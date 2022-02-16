# frozen_string_literal: true

require 'image_processing/mini_magick'

class PlaylistImageUploader < ImageUploader
  # override
  # 画像を出力するパスを生成する
  #
  # https://github.com/d7lab/dot-editorialhands/issues/43
  #
  # Playlist
  # /playlist/pl/recommend-tep-0000000001/recommend-tep-0000000001-eyecatch_151253151.jpg
  # /playlist/pl/recommend-tep-0000000001/recommend-tep-0000000001-eyecatch_X_151253151.jpg
  # /playlist/pl/recommend-tep-0000000001/recommend-tep-0000000001-logo_151253151.jpg
  # /playlist/pl/recommend-tep-0000000001/recommend-tep-0000000001-logo_X_151253151.jpg
  # /playlist/pl/recommend-tep-0000000001/recommend-tep-0000000001-hero_151253151.jpg
  # /playlist/pl/recommend-tep-0000000001/recommend-tep-0000000001-hero_X_151253151.jpg
  # /playlist/pl/recommend-tep-0000000001/recommend-tep-0000000001-role_151253151.jpg
  # /playlist/pl/recommend-tep-0000000001/recommend-tep-0000000001-role_X_151253151.jpg
  def generate_location(io, **context)
    record = context.fetch(:record)
    context = context.deep_symbolize_keys

    "playlist/pl/#{record.string_id}/#{create_filename(io, context)}"
  end

  # ファイル名を生成する
  #
  # @param [Hash] context
  # @return [String]
  def create_filename(io, context)
    ext = File.extname(context.dig(:metadata, :filename)).downcase
    ext = '.jpg' if ext == '.jpeg' # jpegとjpgを統一

    record = context.fetch(:record)

    "#{record.string_id}-#{image_type(context)}#{version_suffix(context)}_#{generate_uid(io)}#{ext}"
  end

  # @param [Hash] context
  # @return [String] 画像種別
  def image_type(context)
    # NOTE: context[:name]に設定されている値の例
    #   Playlist.hero_image_data: :hero_image
    #   Playlist.eyecatch_image_data: :eyecatch_image
    #   Playlist.logo_image_data: :logo_image
    name = context.fetch(:name).to_s
    name.to_s.delete_suffix('_image')
  end

  # @param [Hash] context
  # @return [String] 画像のサイズのsuffix _m, _tver
  def version_suffix(context)
    return if context[:version].blank?
    return if %i[original default].include? context[:version]

    "_#{context[:version]}"
  end
end
