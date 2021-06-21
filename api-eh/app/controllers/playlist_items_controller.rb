# frozen_string_literal: true

class PlaylistItemsController < ApplicationController
  before_action :set_playlist

  def index; end

  def bulk_update
    episodes = params.require(:playlist_items).map { |e| e[:id] }
    @playlist.rebuild_episode_list_to(episodes)
  end

  private

  def set_playlist
    @playlist = Playlist.friendly.find(params[:playlist_id])
  end
end
