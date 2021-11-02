class Embed::PlaylistViewComponentBuilder
  attr_reader :url, :height

  def initialize(playlist_id:, height:, layout_pattern:)
    @playlist_id = playlist_id
    @playlist = Playlist.find(playlist_id)
    @url = "https://dev-www-eh.nr.nhk.jp/p/pl/#{@playlist.original_id}"
    is_exist_pattern = %w[summary largeImage featuredItem itemList].include?(layout_pattern)
    @layout_pattern = is_exist_pattern ? layout_pattern : 'summary'
    @height = height || Oembed::Response::Playlist::DEFAULT_SIZE[@layout_pattern.to_sym][:height]
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
    Embed::SummaryComponent.new(url: @url,
                                name: @playlist.name,
                                eyecatch_image_url: @playlist.eyecatch_image_url,
                                description: @playlist.description,
                                height: @height)
  end

  def build_featured_item_view_component
    episode_id = @playlist.playlist_items.first&.episode_id
    # cache dataが古い可能性があるので、APIからEpisode情報を引き直す
    episode_data = if episode_id
                     DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp')
                                  .episode(type: 'tv', episode_id: episode_id)
                   else
                     {}
                   end

    Embed::FeaturedItemComponent.new(url: @url,
                                     name: @playlist.name,
                                     logo_image_url: @playlist.logo_image_url,
                                     detailed_catch: @playlist.detailed_catch,
                                     key_color: @playlist.primary_light_color,
                                     episode_data: episode_data,
                                     height: @height)
  end

  def build_item_list_view_component
    episodes = []
    item_list_size = 10 # Seriesに合わせて10件（APIで1度に引けるEpisodeの数）
    @playlist.playlist_items.take(item_list_size).each do |ep|
      # cache dataが古い可能性があるので、APIからEpisode情報を引き直す
      episodes << DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp').episode(type: 'tv',
                                                                                   episode_id: ep.episode_id)
    end

    Embed::ItemListComponent.new(url: @url,
                                 name: @playlist.name,
                                 hero_image_url: @playlist.hero_image_url,
                                 key_color: @playlist.primary_light_color,
                                 episodes: episodes,
                                 height: @height)
  end
end
