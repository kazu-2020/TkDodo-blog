# frozen_string_literal: true

class External::PlaylistsController < ApplicationController
  def show
    playlist_id = trim_extension(params[:playlist_id])
    @object_type = params[:type] || 'tvepisode'
    @area = params[:area]
    @request_url = request.url
    @playlist = Playlist.friendly.find(playlist_id)
  end

  private

  def trim_extension(playlist_param)
    playlist_param.gsub('.json', '')
  end
end
