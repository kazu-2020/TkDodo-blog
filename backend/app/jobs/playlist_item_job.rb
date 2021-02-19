# frozen_string_literal: true

class PlaylistItemJob < ApplicationJob
  class_timeout 900 # seconds

  # rubocop:disable Metrics/MethodLength
  rate '1 day'
  def change_status_of_zombified_and_respawned_episodes
    playlist_items = PlaylistItem.all

    playlist_items.each do |playlist_item|
      if playlist_item.discarded?
        begin
          client.episode(type: 'tv', episode_id: playlist_item.episode_id)
          playlist_item.undiscard
        rescue DlabApiClient::NotFound
          # NotFound なら引き続き discarded 状態
        end
      else
        begin
          client.episode(type: 'tv', episode_id: playlist_item.episode_id)
        rescue DlabApiClient::NotFound
          playlist_item.discard
        end
      end
    end
  end
  # rubocop:enable Metrics/MethodLength

  private

  def client
    @client ||= DlabApiClient.new
  end
end
