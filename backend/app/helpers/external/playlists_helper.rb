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
end
