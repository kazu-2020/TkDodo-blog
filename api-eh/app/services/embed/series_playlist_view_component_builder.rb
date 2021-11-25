class Embed::SeriesPlaylistViewComponentBuilder < Embed::ViewComponentBuilder
  def url
    @url ||= "https://dev-www-eh.nr.nhk.jp/p/pl/ts-#{@resource_id}"
  end

  private

  def build_summary_view_component
    res = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp').series(type: 'tv', series_id: @resource_id)
    Embed::SummaryComponent.new(url: url,
                                name: res[:name],
                                eyecatch_image_url: res.dig(:eyecatch, :medium, :url),
                                description: res[:description],
                                height: @height)
  end

  def build_featured_item_view_component
    res = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp').episode_from_series(type: 'tv',
                                                                                       series_id: @resource_id,
                                                                                       request_type: :l,
                                                                                       query: { size: 1 })
    episode_data = res[:result].first
    series_data = episode_data[:partOfSeries]

    Embed::FeaturedItemComponent.new(url: url,
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
                                                                                       series_id: @resource_id,
                                                                                       request_type: :l,
                                                                                       query: { size: item_list_size })
    episodes = res[:result]
    series_data = episodes.first[:partOfSeries]

    # episodeのurlを上書き
    # https://dev-www-eh.nr.nhk.jp/p/pl/ts-xxxxxx#{episode_id}
    episodes.each { |episode| episode[:url] = "#{url}/episode##{episode[:id]}" }

    Embed::ItemListComponent.new(url: url,
                                 name: series_data[:name],
                                 detailed_catch: series_data[:detailedCatch],
                                 hero_image_url: series_data.dig(:hero, :medium, :url),
                                 key_color: series_data.dig(:style, :primaryLight),
                                 episodes: episodes,
                                 height: @height)
  end
end
