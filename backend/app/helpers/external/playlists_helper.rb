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
end
