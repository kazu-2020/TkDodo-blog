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
    episode_id = @playlist.playlist_items.first&.episode_id
    # cache dataが古い可能性があるので、APIからEpisode情報を引き直す
    episode_data = if episode_id
                     DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp')
                                  .episode(type: 'tv', episode_id: episode_id)
                   else
                     {}
                   end

    Embed::FeaturedItemData.new(url: @url,
                                name: @playlist.name,
                                logo_image_url: @playlist.logo_image_url,
                                detailed_catch: @playlist.detailed_catch,
                                episode_data: episode_data)
  end
end
