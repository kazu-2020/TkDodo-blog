# frozen_string_literal: true

class SeriesPlaylistsController < ApiBaseController
  after_action :set_x_api_url_to_header

  def episodes
    @series_playlist = SeriesPlaylist.find(params[:id])
  end

  def search
    @result = SearchSeriesPlaylist.new.call(DlabApiClient.new, search_params)
  end

  private

  def search_params
    { contents_type: 'tvseries', word: params[:word], keyword: params[:keyword], concern: params[:concern],
      size: params[:size], offset: params[:offset] }
  end
end
