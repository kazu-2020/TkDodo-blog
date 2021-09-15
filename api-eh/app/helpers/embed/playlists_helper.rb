# frozen_string_literal: true

module Embed::PlaylistsHelper
  def playlist_image_src
    @playlist&.eyecatch_image_url || '//via.placeholder.com/640x360'
  end
end
