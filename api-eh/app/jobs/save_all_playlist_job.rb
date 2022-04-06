# frozen_string_literal: true

class SaveAllPlaylistJob < SidekiqBaseJob
  sidekiq_options queue: 'p1'

  def perform
    Playlist.find_each(&:save!)
  end
end
