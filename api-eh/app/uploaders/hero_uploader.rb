# frozen_string_literal: true

require 'image_processing/mini_magick'

class HeroUploader < PlaylistImageUploader
  Attacher.derivatives do |original|
    magick = ImageProcessing::MiniMagick.source(original).strip
    file.replace(magick.call)

    {
      default: magick.resize_to_fill!(1920, 640),
      medium: magick.resize_to_fill!(1080, 360)
    }
  end
end
