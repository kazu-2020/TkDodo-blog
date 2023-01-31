# frozen_string_literal: true

class SeriesPlaylistsController < ApiBaseController
  authorize_resource

  def episodes
    @series_playlist = SeriesPlaylist.find(params[:id])
    ability.authorize! :episodes, @series_playlist
  end

  def search
    @result = SearchSeriesPlaylist.new.call(DlabApiClient.new, search_params)
    ability.authorize! :search, SeriesPlaylist
  end

  private

  def search_params
    { contents_type: 'tvseries', word: params[:word], keyword: params[:keyword], concern: params[:concern],
      size: params[:size], offset: params[:offset] }
  end
end
