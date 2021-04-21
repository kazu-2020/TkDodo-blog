# frozen_string_literal: true

class Embed::SeriesController < EmbedController
  def show
    series_id = params[:series_id]
    @series_data = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp').series(type: 'tv', series_id: series_id)

    render 'embed/not_found', status: :not_found and return if @series_data.blank?
  end
end
