# frozen_string_literal: true

class PlaylistJob < ApplicationJob
  class_timeout 300 # seconds

  def delete_all_playlists
    Playlist.destroy_all
  end

  def recalculate_playlist_item_duration
    PlaylistItem.all.each(&:fetch_data)
  end
end
