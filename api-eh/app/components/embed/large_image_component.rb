# frozen_string_literal: true

class Embed::LargeImageComponent < ViewComponent::Base
  include Embed::EpisodesHelper

  attr_reader :url, :name, :logo_image_url, :detailed_catch, :key_color, :episode_data, :height
  alias title name

  # @param [String] url
  # @param [String] name
  # @param [Hash] episode_data
  # @param [String] height
  def initialize(url:, name:, episode_data:, height:)
    super
    @url = url
    @name = name
    @episode_data = episode_data
    @height = height
  end
end
