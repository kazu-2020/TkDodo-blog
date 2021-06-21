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
    @result = client.episode_bundle(type: 'tv', episode_id: params[:id])
  end

  # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity, Metrics/MethodLength
  def bundle_items
    episode_ids = (params[:episode_ids] || '').split(',')
    client = DlabApiClient.new

    result = { tvepisode: 0, event: 0, howto: 0, faqpage: 0 }

    episode_ids.each do |episode_id|
      data =
        begin
          client.episode_bundle(type: 'tv', episode_id: episode_id)
        rescue DlabApiClient::NotFound
          {}
        end

      result[:tvepisode] += 1 if data[:tvepisode] && !data[:tvepisode].empty?
      result[:faqpage] += data[:faqpage].size if data[:faqpage] && !data[:faqpage].empty?
      result[:event] += data[:event].size if data[:event] && !data[:event].empty?
      result[:howto] += data[:howto].size if data[:howto] && !data[:howto].empty?
    end

    render json: result
  end
  # rubocop:enable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity, Metrics/MethodLength

  def playlists
    playlist_ids = PlaylistItem.where(episode_id: params[:id]).kept.pluck(:playlist_id).uniq
    @playlists = Playlist.where(id: playlist_ids)
  end

  private

  def search_params
    params.permit(:word, :concern, :keyword, :offset, :ignore_range, :sort_type, :size, :service)
  end

  def client
    @client ||= DlabApiClient.new
  end
end
