# frozen_string_literal: true

class Embed::PlaylistsController < EmbedController
  def show
    @view_component = build_view_component
    render 'embed/not_found', status: :not_found if @view_component.blank?
  end

  private

  def build_view_component
    if embed_params[:playlist_id].start_with?('eh-')
      build_playlist_view_component
    elsif embed_params[:playlist_id].start_with?('ts-')
      build_series_view_component
    else
      raise ArgumentError, 'Invalid id'
    end
  end

  def build_playlist_view_component
    playlist_id = embed_params[:playlist_id].delete_prefix('eh-').to_i
    Embed::PlaylistViewComponentBuilder.new(playlist_id: playlist_id,
                                            height: embed_params[:height],
                                            layout_pattern: embed_params[:layout_pattern]).call
  end

  def build_series_view_component
    series_id = embed_params[:playlist_id].delete_prefix('ts-')
    Embed::SeriesViewComponentBuilder.new(series_id: series_id,
                                          height: embed_params[:height],
                                          layout_pattern: embed_params[:layout_pattern]).call
  end

  def embed_params
    params.permit(:playlist_id, :height, :layout_pattern)
  end
end
