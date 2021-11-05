# frozen_string_literal: true

class Embed::SummaryComponent < ViewComponent::Base
  attr_reader :url, :name, :eyecatch_image_url, :description, :height
  alias title name

  def initialize(url:, name:, eyecatch_image_url:, description:, height:)
    super
    @url = url
    @name = name
    @eyecatch_image_url = eyecatch_image_url
    @description = description
    @height = height
  end
end
