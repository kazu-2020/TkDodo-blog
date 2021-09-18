class Embed::BuildSeriesViewData
  attr_reader :url, :height

  def initialize(series_id:, layout_pattern:)
    @series_id = series_id
    @layout_pattern = layout_pattern
  end

  def call
    case @layout_pattern
    when 'summary'
      summary_view_data
    when 'featuredItem'
      featured_item_view_data
    end
  rescue DlabApiClient::NotFound
    nil
  end

  private

  def summary_view_data
    res = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp').series(type: 'tv', series_id: @series_id)
    Embed::SummaryData.new(url: res[:url],
                           name: res[:name],
                           eyecatch_image_url: res.dig(:eyecatch, :medium, :url),
                           description: res[:description])
  end

  def featured_item_view_data # rubocop:disable Metrics/MethodLength
    res = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp').episode_from_series(type: 'tv',
                                                                                       series_id: @series_id,
                                                                                       request_type: :l,
                                                                                       query: { size: 1 })
    episode_data = res[:result].first
    series_data = episode_data[:partOfSeries]
    episode_eyecatch_image_url = episode_data.dig(:eyecatch, :medium, :url) ||
                                 episode_data.dig(:eyecatch, :tver, :url) ||
                                 episode_data.dig(:eyecatch, :main, :url) ||
                                 episode_data.dig(:partOfSeries, :eyecatch, :medium, :url)

    Embed::FeaturedItemData.new(url: series_data[:url],
                                series_name: series_data[:name],
                                series_logo_image_url: series_data.dig(:logo, :medium, :url),
                                series_detailed_catch: series_data[:detailedCatch],
                                episode_name: episode_data[:name],
                                episode_eyecatch_image_url: episode_eyecatch_image_url)
  end
end
