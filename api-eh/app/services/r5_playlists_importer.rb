class R5PlaylistsImporter
  AREA_ID = '130'.freeze

  # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
  def execute
    deck = Deck.find_by(area: AREA_ID, is_r5: true)

    recommend_playlist_ids.each do |playlist_id|
      res = r5_client.playlist(playlist_type: 'recommend', playlist_id: playlist_id)
      playlist = deck.playlists.find_or_initialize_by(d5_playlist_id: res[:playlist_id])
      assign_playlist_attributes(playlist, res)
      playlist.playlist_items.destroy_all # 冪等性を保つため、discarded は使わず、一度全削除

      playlist.save

      res[:body].each do |stream|
        broadcast_event_id = stream[:stream_id].gsub('_', "-#{AREA_ID}-")
        begin
          episode = r6_client.episode_from_broadcast_event(type: 'tvepisode', broadcast_event_id: broadcast_event_id)
          playlist_item = playlist.playlist_items.find_or_create_by(episode_id: episode[:id])
          playlist_item.fetch_data
        rescue DlabApiBase::NotFound
          # TODO: do something
        end
      end
    end
  end
  # rubocop:enable Metrics/MethodLength, Metrics/AbcSize

  private

  def r5_client
    @r5_client ||= DlabPlApiClient.new
  end

  def r6_client
    @r6_client ||= DlabApiClient.new
  end

  def recommend_playlist_ids
    return @recommend_playlist_ids if @recommend_playlist_ids.present?

    res = r5_client.deck(area_id: '000')
    @recommend_playlist_ids =
      res.dig(:config, :playlists, :recommend).map do |playlist|
        playlist[:playlist_id]
      end.reverse
  end

  # rubocop:disable Metrics/AbcSize
  def assign_playlist_attributes(playlist, data)
    playlist.name = data[:playlist_name]
    playlist.description = data[:playlist_description]
    playlist.logo_image_remote_url = data.dig(:images, :logo_l, :url)
    playlist.eyecatch_image_remote_url = data.dig(:images, :thumbnail_m, :url)
    playlist.selected_palette = data.dig(:styles, :background)
    return if playlist.selected_palette.blank?

    color_adjustor = ColorAdjustor.new(playlist.selected_palette)
    playlist.primary_light_color = color_adjustor.primary_light_color
    playlist.primary_dark_color = color_adjustor.primary_dark_color
    playlist.link_light_color = color_adjustor.link_light_color
    playlist.link_dark_color = color_adjustor.link_dark_color
  end
  # rubocop:enable Metrics/AbcSize
end
