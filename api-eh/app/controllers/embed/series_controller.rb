# frozen_string_literal: true

class Embed::SeriesController < EmbedController
  def show
    series_id = params[:series_id]
    @series_data = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp').series(type: 'tv', series_id: series_id)
    @height = embed_series_params[:height] || 210
    set_layout_pattern

    render 'embed/not_found', status: :not_found and return if @series_data.blank?
  rescue DlabApiBase::NotFound
    render 'embed/not_found', status: :not_found
  end

  private

  def embed_series_params
    params.permit(:series_id, :height, :layout_pattern)
  end

  def set_layout_pattern
    is_exist_pattern = %w[summary large_image featured_item item_list].include?(embed_series_params[:layout_pattern])
    @layout_pattern = is_exist_pattern ? embed_series_params[:layout_pattern] : 'summary'
  end
end
