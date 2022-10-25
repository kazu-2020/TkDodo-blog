# frozen_string_literal: true

class PlaylistItemsController < ApiBaseController
  after_action :set_x_api_url_to_header
  before_action :set_playlist

  def index
    @playlist_items = @playlist.playlist_items.kept
    @playlist_items = @playlist_items.first(params[:limit].to_i) if params[:limit]
  end

  def bulk_update
    episodes = params.require(:playlist_items).map { |e| e[:id] }
    @playlist.rebuild_episode_list_to(episodes)
  end

  private

  def set_playlist
    @playlist = Playlist.friendly.find(params[:playlist_id])
  end
end
