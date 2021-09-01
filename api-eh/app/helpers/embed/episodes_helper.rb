# frozen_string_literal: true

module Embed::EpisodesHelper
  def episode_image_src
    episode_eyecatch_image_url || keyvisual_url || series_eyecatch_image_url || '//via.placeholder.com/640x360'
  end

  private

  # TODO: episodeのeyecatchが無かった時にseriesのeyecatchを表示する
  def episode_eyecatch_image_url
    @episode_data.dig(:eyecatch, :medium, :url) ||
      @episode_data.dig(:eyecatch, :tver, :url) ||
      @episode_data.dig(:eyecatch, :main, :url)
  end

  def keyvisual_url
    kv = @episode_data[:keyvisuals]&.first
    return nil if kv.blank?

    kv.dig(:small, :url) || kv.dig(:large, :url) || kv.dig(:xlarge, :url)
  end

  def series_eyecatch_image_url
    @episode_data.dig(:partOfSeries, :eyecatch, :medium, :url)
  end
end
