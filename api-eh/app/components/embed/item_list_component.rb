# frozen_string_literal: true

class Embed::ItemListComponent < ViewComponent::Base
  include Embed::EpisodesHelper

  attr_reader :url, :name, :detailed_catch, :hero_image_url, :key_color, :episodes, :height
  alias title name

  def initialize(url:, name:, detailed_catch:, hero_image_url:, key_color:, episodes:, height:) # rubocop:disable Metrics/ParameterLists
    super
    @url = url
    @name = name
    @detailed_catch = detailed_catch
    @hero_image_url = hero_image_url
    @key_color = key_color
    @episodes = episodes
    @height = height
    # byebug
  end

  def base64_image_src
    return if hero_image_url.blank?

    # TODO: Playlistの時URI.openが失敗しないように修正する
    begin
      "data:image/png;base64,#{Base64.strict_encode64(URI.open(logo_image_url).read)}" # rubocop:disable Security/Open
    rescue => e
      p e.backtrace
    end
  end
end
