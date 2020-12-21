# frozen_string_literal: true

require 'image_processing/mini_magick'

class ImageUploader < Shrine
  ALLOWED_TYPES = %w[image/jpeg image/png image/gif image/webp].freeze
  MAX_SIZE = 10 * 1024 * 1024 # 10 MB

  plugin :remove_attachment # adds the remove_<name> accessor to model, removes the attached file if it set a true
  plugin :store_dimensions, analyzer: :mini_magick
  plugin :url_options, store: { host: Jets.application.config.shrine_config[:default_url], public: true }
  plugin :validation_helpers, default_messages: {
    max_size: ->(max) { I18n.t('errors.file.max_size', max: max) },
    max_width: ->(max) { I18n.t('errors.file.max_width', max: max) },
    max_height: ->(max)  { I18n.t('errors.file.max_height', max: max) },
    mime_type_inclusion: ->(list) { I18n.t('errors.file.mime_type_inclusion', list: list) }
  } # validation用のヘルパーメソッドを追加するプラグイン

  Attacher.validate do
    validate_max_size MAX_SIZE
    if validate_mime_type_inclusion(ALLOWED_TYPES)
      validate_max_width 5000
      validate_max_height 5000
    end
  end
end
