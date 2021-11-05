class Embed::SeriesViewComponentBuilder
  attr_reader :url, :height

  def initialize(series_id:, height:, layout_pattern:)
    @series_id = series_id
    is_exist_pattern = %w[summary largeImage featuredItem itemList].include?(layout_pattern)
    @layout_pattern = is_exist_pattern ? layout_pattern : 'summary'
    @height = height || Oembed::Response::Series::DEFAULT_SIZE[@layout_pattern.to_sym][:height]
  end

  def call
    case @layout_pattern
    when 'summary'
      build_summary_view_component
    when 'featuredItem'
      build_featured_item_view_component
    when 'itemList'
      build_item_list_view_component
    end
  rescue DlabApiClient::NotFound
    nil
  end

  private

  def build_summary_view_component
    res = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp').series(type: 'tv', series_id: @series_id)
    Embed::SummaryComponent.new(url: res[:url],
                                name: res[:name],
                                eyecatch_image_url: res.dig(:eyecatch, :medium, :url),
                                description: res[:description],
                                height: @height)
  end

  def build_featured_item_view_component
    res = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp').episode_from_series(type: 'tv',
                                                                                       series_id: @series_id,
                                                                                       request_type: :l,
                                                                                       query: { size: 1 })
    episode_data = res[:result].first
    series_data = episode_data[:partOfSeries]

    Embed::FeaturedItemComponent.new(url: series_data[:url],
                                     name: series_data[:name],
                                     logo_image_url: series_data.dig(:logo, :medium, :url),
                                     detailed_catch: series_data[:detailedCatch],
                                     key_color: series_data.dig(:style, :primaryLight),
                                     episode_data: episode_data,
                                     height: @height)
  end

  def build_item_list_view_component
    item_list_size = 10 # APIで1度に引けるEpisodeの数
    res = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp').episode_from_series(type: 'tv',
                                                                                       series_id: @series_id,
                                                                                       request_type: :l,
                                                                                       query: { size: item_list_size })
    episode_data = res[:result].first
    series_data = episode_data[:partOfSeries]

    Embed::ItemListComponent.new(url: series_data[:url],
                                 name: series_data[:name],
                                 detailed_catch: series_data[:detailedCatch],
                                 hero_image_url: series_data.dig(:hero, :medium, :url),
                                 key_color: series_data.dig(:style, :primaryLight),
                                 episodes: res[:result],
                                 height: @height)
  end
end
