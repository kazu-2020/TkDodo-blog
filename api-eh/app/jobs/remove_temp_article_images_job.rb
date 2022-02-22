# frozen_string_literal: true

class RemoveTempArticleImagesJob < SidekiqBaseJob
  sidekiq_options queue: 'p5'

  def perform
    super
    Playlist.find_each { |pl| RemoveTempArticleImageJob.perform_async(pl.id) }
  end
end
