# frozen_string_literal: true

class Embed::SeriesController < EmbedController
  def show
    @view_component = Embed::SeriesViewComponentBuilder.new(series_id: embed_params[:series_id],
                                                            height: embed_params[:height],
                                                            layout_pattern: embed_params[:layout_pattern]).call

    render 'embed/not_found', status: :not_found if @view_component.blank?
  end

  private

  def embed_params
    params.permit(:series_id, :height, :layout_pattern)
  end
end
