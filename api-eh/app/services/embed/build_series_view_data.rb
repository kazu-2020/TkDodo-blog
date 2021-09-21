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

  def featured_item_view_data
    res = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp').episode_from_series(type: 'tv',
                                                                                       series_id: @series_id,
                                                                                       request_type: :l,
                                                                                       query: { size: 1 })
    episode_data = res[:result].first
    series_data = episode_data[:partOfSeries]

    Embed::FeaturedItemData.new(url: series_data[:url],
                                name: series_data[:name],
                                logo_image_url: series_data.dig(:logo, :medium, :url),
                                detailed_catch: series_data[:detailedCatch],
                                episode_data: episode_data)
  end
end
