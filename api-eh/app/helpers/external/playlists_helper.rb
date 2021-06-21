# frozen_string_literal: true

module External::PlaylistsHelper
  include ::PlaylistsHelper

  def fetch_boradcast_event(episode, options)
    return nil if episode[:detailedRecentEvent].blank?

    client = DlabApiClient.new
    begin
      client.broadcast_event(episode[:detailedRecentEvent][:id], options)
    rescue DlabApiClient::NotFound
      nil
    end
  end

  def type_of_item(object_type)
    case object_type
    when 'broadcastevent' then 'BroadcastEvent'
    when 'videoobject' then 'VideoObject'
    else 'TVEpisode'
    end
  end

  def deck_url(deck, deck_id, object_type)
    base_url = 'https://dev-api-eh.nr.nhk.jp/d6.6/t/ndeck/recommend'

    case deck_id
    when /visible/
      base_url + "/visible#{deck.is_r5? ? '-r5' : ''}.json?area=#{deck.area}&type=#{object_type}"
    when /editorial/
      base_url + "/editorial#{deck.is_r5? ? '-r5' : ''}.json?area=#{deck.area}&type=#{object_type}"
    else
      ''
    end
  end

  def format_genre(playlist)
    return [] if playlist.format_genre_code.nil?

    [
      { id: playlist.format_genre_code, name: playlist.format_genre_name }
    ]
  end

  def theme_genre(playlist)
    return [] if playlist.theme_genre_code.nil?

    [
      { id: playlist.theme_genre_code, name: playlist.theme_genre_name }
    ]
  end
end
