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

  def deck_ids(playlist)
    if playlist.deck.present?
      if playlist.has_article?
        %w[recommend-visible-r5-130 recommend-editorial-r5-130]
      else
        ['recommend-visible-r5-130']
      end
    elsif playlist.has_article?
      %w[recommend-visible-130 recommend-editorial-130]
    else
      ['recommend-visible-130']
    end
  end
end
