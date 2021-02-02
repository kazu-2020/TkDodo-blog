# frozen_string_literal: true

class External::PlaylistsController < ApplicationController
  def show
    playlist_id = convert_playlist_id(params[:playlist_id])
    @object_type = params[:type] || 'tvepisode'
    @area = params[:area]
    @request_url = request.url
    @playlist = Playlist.friendly.find(playlist_id)
  end

  private

  def convert_playlist_id(playlist_id)
    converted_playlist_id = playlist_id.gsub('.json', '').gsub('eh-', '')
    converted_playlist_id.to_i
  end
end
