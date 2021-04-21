# frozen_string_literal: true

module Embed::EpisodesHelper
  def episode_image_src
    @episode_data.dig(:eyecatch, :medium, :url) || @episode_data[:keyvisuals].first.dig(:small, :url)
  end
end
