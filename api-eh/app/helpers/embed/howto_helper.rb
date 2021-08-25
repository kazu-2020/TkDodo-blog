# frozen_string_literal: true

module Embed::HowtoHelper
  def howto_image_src
    @howto_data.dig(:image, :medium, :url) || episode_image_src
  end
end
