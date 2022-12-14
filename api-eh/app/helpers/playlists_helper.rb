# frozen_string_literal: true

module PlaylistsHelper
  # 非同期処理中に表示する画像のパス
  # frontend-edgeに配置しています
  TMP_LOGO_IMG_UPLOADING_PATH = '/loading/loading-logo.png'
  TMP_EYECATCH_IMG_UPLOADING_PATH = '/loading/loading-eyecatch.png'
  TMP_HERO_IMG_UPLOADING_PATH = '/loading/loading-hero.png'

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
  #          storeの時は生成済みの画像パスを返す
  # @param [Attacher] image_attacher
  def image_url(image_attacher)
    return image_attacher.url if image_attacher.stored?

    case image_attacher.name
    when :logo_image
      TMP_LOGO_IMG_UPLOADING_PATH
    when :eyecatch_image
      TMP_EYECATCH_IMG_UPLOADING_PATH
    when :hero_image
      TMP_HERO_IMG_UPLOADING_PATH
    end
  end
end
