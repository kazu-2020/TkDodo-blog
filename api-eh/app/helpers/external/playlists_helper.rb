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

  def fetch_event(episode)
    client = DlabApiClient.new
    begin
      client.episode_event(episode_id: episode[:id])
    rescue DlabApiClient::NotFound
      nil
    end
  end

  def fetch_howto(episode)
    client = DlabApiClient.new
    begin
      client.episode_howto(episode_id: episode[:id])
    rescue DlabApiClient::NotFound
      nil
    end
  end

  def fetch_faq_page(episode)
    client = DlabApiClient.new
    begin
      client.episode_faq_page(episode_id: episode[:id])
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
    when /tv/
      base_url = 'https://dev-api-eh.nr.nhk.jp/d6.6/t/ndeck/dk'
      base_url + "/recommend-#{deck.is_r5? ? 'r5' : 'r6'}-tv-130.json?type=#{object_type}"
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
