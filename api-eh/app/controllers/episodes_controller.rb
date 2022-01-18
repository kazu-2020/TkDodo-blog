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
    client = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp')
    @result = client.episode_l_bundle(type: 'tv', episode_id: params[:id], query: { size: 10 })
  end

  # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/MethodLength
  def bundle_items
    episode_ids = (params[:episode_ids] || '').split(',')
    client = DlabApiClient.new

    result = { tvepisode: 0, event: 0, howto: 0, faqpage: 0 }

    episode_ids.each do |episode_id|
      data =
        begin
          client.episode_list_bundle(type: 'tv', episode_id: episode_id)
        rescue DlabApiClient::NotFound
          {}
        end

      result[:tvepisode] += data.dig(:tvepisode, :count) || 0
      result[:faqpage] += data.dig(:faqpage, :count) || 0
      result[:event] += data.dig(:event, :count) || 0
      result[:howto] += data.dig(:howto, :count) || 0
    end

    render json: result
  end
  # rubocop:enable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/MethodLength

  def playlists
    playlist_ids = PlaylistItem.where(episode_id: params[:id]).kept.pluck(:playlist_id).uniq
    @playlists = Playlist.where(id: playlist_ids)
  end

  private

  def search_params
    params.permit(:word, :concern, :keyword, :offset, :ignore_range, :order, :order_by, :size, :service)
  end
end
