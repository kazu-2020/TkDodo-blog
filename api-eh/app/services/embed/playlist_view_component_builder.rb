class Embed::PlaylistViewComponentBuilder < Embed::ViewComponentBuilder
  def url
    @url ||= "https://dev-www-eh.nr.nhk.jp/p/pl/#{playlist.original_id}"
  end

  def playlist
    @playlist ||= Playlist.find(@resource_id)
  end

  private

  def build_summary_view_component
    Embed::SummaryComponent.new(url: url,
                                name: playlist.name,
                                eyecatch_image_url: playlist.eyecatch_image_url,
                                description: playlist.description,
                                height: @height)
  end

  def build_featured_item_view_component
    episode_id = playlist.playlist_items.first&.episode_id
    # cache dataが古い可能性があるので、APIからEpisode情報を引き直す
    episode_data = if episode_id
                     DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp')
                                  .episode(type: 'tv', episode_id: episode_id)
                   else
                     {}
                   end

    Embed::FeaturedItemComponent.new(url: url,
                                     name: playlist.name,
                                     logo_image_url: playlist.logo_image_url,
                                     detailed_catch: playlist.detailed_catch,
                                     key_color: playlist.primary_light_color,
                                     episode_data: episode_data,
                                     height: @height)
  end

  def build_item_list_view_component # rubocop:disable Metrics/AbcSize
    episodes = []
    item_list_size = 10 # Seriesに合わせて10件（APIでデフォルトで1度に引けるEpisodeの数）
    playlist.playlist_items.take(item_list_size).each do |ep|
      # cache dataが古い可能性があるので、APIからEpisode情報を引き直す
      episodes << DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp').episode(type: 'tv',
                                                                                   episode_id: ep.episode_id)
    end

    Embed::ItemListComponent.new(url: url,
                                 name: playlist.name,
                                 detailed_catch: playlist.detailed_catch,
                                 hero_image_url: playlist.hero_image_url,
                                 key_color: playlist.primary_light_color,
                                 episodes: episodes,
                                 height: @height)
  end
end
