# frozen_string_literal: true

class EpisodesController < ApplicationController
  rescue_from DlabApiClient::NotFound do |exception|
    render json: { message: 'エピソードが見つかりませんでした', error: exception.message }, status: 404
  end
  rescue_from DlabApiClient::BadRequest, DlabApiClient::Forbidden,
              DlabApiClient::InternalServerError, DlabApiClient::BadGateway,
              DlabApiClient::ServiceUnavailable, DlabApiClient::GatewayTimeout do |exception|
    render json: { message: 'エピソード検索ができませんでした', error: exception.message }, status: 400
  end

  def search
    client = DlabApiClient.new
    @result = client.search(search_params)
  end

  def bundle
    client = DlabApiClient.new
    @result = client.episode_bundle(type: 'tv', episode_id: params[:episode_id])
  end

  def playlists
    playlist_ids = PlaylistItem.where(episode_id: params[:episode_id]).pluck(:playlist_id).uniq
    @playlists = Playlist.where(id: playlist_ids)
  end

  private

  def search_params
    params.permit(:word, :offset, :ignore_range, :sort_type, :size)
  end
end
