# frozen_string_literal: true

require 'image_processing/mini_magick'

class LogoUploader < PlaylistImageUploader
  Attacher.derivatives do |original|
    magick = ImageProcessing::MiniMagick.source(original).strip
    file.replace(magick.call)

    {
      default: magick.resize_to_fill!(1080, 1080),
      medium: magick.resize_to_fill!(640, 640),
      small: magick.resize_to_fill!(200, 200)
    }
  end
end
