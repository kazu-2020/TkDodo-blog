# frozen_string_literal: true

class SeriesPlaylistsController < ApplicationController
  def episodes
    @series_playlist = SeriesPlaylist.find(params[:id])
  end

  def search
    client = DlabApiClient.new
    @result = client.search(search_params)
  end

  private

  def search_params
    { type: 'tvseries', word: params[:word], keyword: params[:keyword], concern: params[:concern],
      size: params[:size], offset: params[:offset] }
  end
end
