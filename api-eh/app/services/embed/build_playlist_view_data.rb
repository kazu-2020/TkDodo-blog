class Embed::BuildPlaylistViewData
  attr_reader :url, :height

  def initialize(playlist_id:, layout_pattern:)
    @layout_pattern = layout_pattern
    @playlist_id = playlist_id
    @playlist = Playlist.find(playlist_id)
    @url = "https://dev-www-eh.nr.nhk.jp/p/pl/#{@playlist.original_id}"
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
    Embed::SummaryData.new(url: @url,
                           name: @playlist.name,
                           eyecatch_image_url: @playlist.eyecatch_image_url,
                           description: @playlist.description)
  end

  def featured_item_view_data
    episode_data = @playlist.playlist_items.first&.cached_data&.symbolize_keys # FIXME: API引き直した方が良さそう
    episode_eyecatch_image_url = episode_data.dig(:eyecatch, :medium, :url) ||
                                 episode_data.dig(:eyecatch, :tver, :url) ||
                                 episode_data.dig(:eyecatch, :main, :url) ||
                                 episode_data.dig(:partOfSeries, :eyecatch, :medium, :url)

    Embed::FeaturedItemData.new(url: @url,
                                series_name: @playlist.name,
                                series_logo_image_url: @playlist.logo_image_url,
                                series_detailed_catch: @playlist.detailed_catch,
                                episode_name: episode_data[:name],
                                episode_eyecatch_image_url: episode_eyecatch_image_url)
  end
end
