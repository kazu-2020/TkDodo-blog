# frozen_string_literal: true

class Embed::FeaturedItemComponent < ViewComponent::Base
  include Embed::EpisodesHelper

  attr_reader :url, :name, :logo_image_url, :detailed_catch, :key_color, :episode_data, :height
  alias title name

  def initialize(url:, name:, logo_image_url:, detailed_catch:, key_color:, episode_data:, height:) # rubocop:disable Metrics/ParameterLists
    super
    @url = url
    @name = name
    @logo_image_url = logo_image_url
    @detailed_catch = detailed_catch
    @key_color = key_color
    @episode_data = episode_data
    @height = height
  end

  def base64_image_src
    return if logo_image_url.blank?

    # TODO: Playlistの時URI.openが失敗しないように修正する
    begin
      "data:image/png;base64,#{Base64.strict_encode64(URI.open(logo_image_url).read)}" # rubocop:disable Security/Open
    rescue => e
      p e.backtrace
    end
  end
end
