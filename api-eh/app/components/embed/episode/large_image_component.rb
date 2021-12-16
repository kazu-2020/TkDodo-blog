# frozen_string_literal: true

class Embed::Episode::LargeImageComponent < ViewComponent::Base
  include Embed::EpisodesHelper

  attr_reader :episode_data, :height

  # @param [Hash] episode_data
  # @param [String] height
  def initialize(episode_data:, height:)
    super
    @episode_data = episode_data
    @height = height
  end
end
