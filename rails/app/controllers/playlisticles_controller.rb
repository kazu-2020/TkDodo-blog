# frozen_string_literal: true

class PlaylisticlesController < ApplicationController
  include D65ApiCallable

  def sandbox
    @playlist = api_client.playlist(series_id: 'QLZLXN22G2')
  end

  def sandbox2
    @playlist = Playlist.find(Playlist.pluck(:id).sample)
    @playlist = Playlist.find(Playlist.pluck(:id).sample) while @playlist.playlist_items.kept.size.zero?
  end

  def sandbox_word
    @playlist = api_client.playlist(series_id: 'QLZLXN22G2')
  end

  private

  def api_client
    @api_client ||= DlabExperimentalApiClient.new
  end
end
