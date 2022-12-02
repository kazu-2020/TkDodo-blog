# frozen_string_literal: true

module PlaylistsHelper
  def build_act_list(playlist)
    act_list = []
    playlist[:items].each do |episode|
      broadcast_event = episode[:broadcastEvent].first
      act_list << broadcast_event[:misc][:actList] if broadcast_event
    end

    act_list.flatten.map { |act| act[:name] }.uniq
  end

  def fetch_unique_actors(playlist)
    actors =
      playlist.playlist_items.kept.map do |playlist_item|
        playlist_item.episode_data[:actors]
      end.flatten

    actors.uniq do |actor|
      actor[:person][:name]
    end
  end

  # rubocop:disable Metrics/AbcSize
  def fetch_unique_contributors(playlist)
    contributors = playlist.playlist_items.kept.map do |playlist_item|
      playlist_item.episode_data[:contributors]
    end.flatten

    person_array = contributors.select { |contributor| contributor[:person].present? }
    organization_array = contributors.select { |contributor| contributor[:organization].present? }

    person_array.uniq { |person| person[:person][:name] } + organization_array.uniq { |org| org[:organization][:name] }
  end
  # rubocop:enable Metrics/AbcSize

  # storage: cacheの時は画像生成中を表す画像パスを返す
  #         storeの時は生成済みの画像パスを返す
  # @param [Object] image
  # @param [String] image_type:'LOGO', 'EYECATCH', 'HERO'
  # @param [Boolean] is_stored
  def image_url(image:, image_type:, is_stored:)
    if is_stored
      image.url
    else
      case image_type
      when 'LOGO'
        Playlist::TMP_LOGO_IMG_UPLOADING
      when 'EYECATCH'
        Playlist::TMP_EYECATCH_IMG_UPLOADING
      when 'HERO'
        Playlist::TMP_HERO_IMG_UPLOADING
      end
    end
  end
end
