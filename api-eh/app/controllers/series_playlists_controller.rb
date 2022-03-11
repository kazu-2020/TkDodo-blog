# frozen_string_literal: true

class SeriesPlaylistsController < ApplicationController
  def episodes
    @series_playlist = SeriesPlaylist.find(params[:id])
  end
end
