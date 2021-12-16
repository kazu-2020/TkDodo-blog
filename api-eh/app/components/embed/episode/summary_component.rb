# frozen_string_literal: true

class Embed::Episode::SummaryComponent < ViewComponent::Base
  include Embed::EpisodesHelper

  attr_reader :episode_data, :height

  def initialize(episode_data:, height:)
    super
    @episode_data = episode_data
    @height = height
  end

  def title
    @episode_data[:name]
  end
end
