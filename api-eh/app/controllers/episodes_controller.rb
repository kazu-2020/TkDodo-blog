# frozen_string_literal: true

class EpisodesController < ApiBaseController
  after_action :set_x_api_url_to_header

  rescue_from DlabApiClient::NotFound do |exception|
    render json: { message: 'エピソードが見つかりませんでした', error: exception.message }, status: 404
  end
  rescue_from DlabApiClient::BadRequest, DlabApiClient::Forbidden,
              DlabApiClient::InternalServerError, DlabApiClient::BadGateway,
              DlabApiClient::ServiceUnavailable, DlabApiClient::GatewayTimeout do |exception|
    render json: { message: 'エピソード検索ができませんでした', error: exception.message }, status: 400
  end

  def search
    case search_params[:contents_type]
    when 'tvepisode'
      @result = SearchEpisodes.new.call(client: DlabApiClient.new, search_params: search_params)
    when 'tvseries'
      @result = SearchSeries.new.call(client: DlabApiClient.new, search_params: search_params)
    when 'nplaylist'
      @result = SearchPlaylists.new.call(client: PocApiClient.new, search_params: search_params)
    end
  end

  def bundle
    client = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp')
    @result = client.episode_l_bundle(type: 'tv', episode_id: params[:id], query: { size: 10 })
  end

  def playlists
    playlist_ids = PlaylistItem.where(episode_id: params[:id]).kept.pluck(:playlist_id).uniq
    @playlists = Playlist.where(id: playlist_ids)
  end

  private

  def search_params
    params.permit(:word, :concern, :keyword, :offset, :ignore_range, :order, :order_by, :size, :service, :vService,
                  :contents_type, :series_id, :playlist_id, :mode_of_item, :type_of_list)
  end
end
