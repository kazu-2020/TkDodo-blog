# frozen_string_literal: true

class FillPlaylistDefaultValueJob < SidekiqBaseJob
  sidekiq_options queue: 'p1'

  def perform
    Playlist.where("publish_level != 'full' OR layout_pattern != 'summary'").each do |playlist|
      playlist.full!
      playlist.layout_pattern = 'summary'
      playlist.save
    end
  end
end
