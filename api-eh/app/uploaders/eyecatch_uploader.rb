# frozen_string_literal: true

require 'image_processing/mini_magick'

class EyecatchUploader < PlaylistImageUploader
  Attacher.derivatives do |original|
    magick = ImageProcessing::MiniMagick.source(original).strip
    file.replace(magick.call)

    {
      default: magick.resize_to_fill!(1920, 1080),
      large: magick.resize_to_fill!(1280, 720),
      medium: magick.resize_to_fill!(640, 360),
      small: magick.resize_to_fill!(320, 180)
    }
  end
end
