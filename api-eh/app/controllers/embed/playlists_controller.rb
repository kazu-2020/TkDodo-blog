# frozen_string_literal: true

class Embed::PlaylistsController < EmbedController
  def show # rubocop:disable Metrics/AbcSize
    playlist_id = params[:playlist_id].delete_prefix('eh-').to_i
    @url = "https://dev-www-eh.nr.nhk.jp/p/pl/#{playlist_id}"
    @playlist = Playlist.find(playlist_id)
    @episode_data = @playlist.playlist_items.first.cached_data.symbolize_keys
    set_layout_pattern
    @height = embed_playlists_params[:height] || Oembed::Response::Playlist::DEFAULT_HEIGHT[@layout_pattern.to_sym]

    render 'embed/not_found', status: :not_found and return if @episode_data.blank?
  rescue DlabApiBase::NotFound
    render 'embed/not_found', status: :not_found
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
