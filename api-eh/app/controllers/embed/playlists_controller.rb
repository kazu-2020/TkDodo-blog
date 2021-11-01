# frozen_string_literal: true

class Embed::PlaylistsController < EmbedController
  def show
    playlist_id = embed_params[:playlist_id].delete_prefix('eh-').to_i
    @view_component = Embed::PlaylistViewComponentBuilder.new(playlist_id: playlist_id,
                                                              height: embed_params[:height],
                                                              layout_pattern: embed_params[:layout_pattern]).call
    render 'embed/not_found', status: :not_found if @view_component.blank?
  end

  private

  def embed_params
    params.permit(:playlist_id, :height, :layout_pattern)
  end
end
