# frozen_string_literal: true

class Embed::PlaylistsController < EmbedController
  def show
    set_layout_pattern
    playlist_id = params[:playlist_id].delete_prefix('eh-').to_i
    @view_data = Embed::BuildPlaylistViewData.new(playlist_id: playlist_id, layout_pattern: @layout_pattern).call
    @height = embed_playlists_params[:height] ||
              Oembed::Response::Playlist::DEFAULT_SIZE[@layout_pattern.to_sym][:height]

    render 'embed/not_found', status: :not_found if @view_data.blank?
  end

  private

  def embed_playlists_params
    params.permit(:playlist_id, :height, :layout_pattern)
  end

  def set_layout_pattern
    is_exist_pattern = %w[summary largeImage featuredItem itemList].include?(embed_playlists_params[:layout_pattern])
    @layout_pattern = is_exist_pattern ? embed_playlists_params[:layout_pattern] : 'summary'
  end
end
