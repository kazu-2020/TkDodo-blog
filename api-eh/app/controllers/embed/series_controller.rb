# frozen_string_literal: true

class Embed::SeriesController < EmbedController
  def show
    set_layout_pattern
    @view_data = Embed::BuildSeriesViewData.new(series_id: params[:series_id], layout_pattern: @layout_pattern).call
    @height = embed_series_params[:height] || Oembed::Response::Series::DEFAULT_SIZE[@layout_pattern.to_sym][:height]

    render 'embed/not_found', status: :not_found if @view_data.blank?
  end

  private

  def embed_series_params
    params.permit(:series_id, :height, :layout_pattern)
  end

  def set_layout_pattern
    is_exist_pattern = %w[summary largeImage featuredItem itemList].include?(embed_series_params[:layout_pattern])
    @layout_pattern = is_exist_pattern ? embed_series_params[:layout_pattern] : 'summary'
  end
end
