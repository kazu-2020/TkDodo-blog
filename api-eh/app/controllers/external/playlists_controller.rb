# frozen_string_literal: true

class External::PlaylistsController < ApplicationController
  rescue_from ActionController::UnknownFormat, ActionView::MissingTemplate do
    render json: { message: '該当リソースは見つかりませんでした' }, status: 404
  end

  # rubocop:disable Metrics/PerceivedComplexity, Metrics/CyclomaticComplexity, Metrics/AbcSize, Metrics/MethodLength
  def index
    @area = params[:area]
    is_r5 = !(params[:deck_id] =~ /r5/).nil?
    @deck = Deck.find_by(area: @area, is_r5: is_r5)
    @offset = (params[:offset] || 0).to_i
    @size = (params[:size] || 10).to_i
    consume_action = (params[:consumeAction] || '').split(',')
    order = params[:order] || 'desc'
    order_by = params[:orderBy] || 'dateModified'

    render json: { message: 'デッキが見つかりませんでした' }, status: 404 and return unless @deck
    render json: { message: '無効なパラメーターが指定されています' }, status: 400 and return unless %w[asc desc].include?(order)

    unless %w[dateModified dateCreated].include?(order_by)
      render json: { message: '無効なパラメーターが指定されています' }, status: 400
      return
    end

    @playlists = @deck.playlists.draft
    @playlists = @playlists.has_article if consume_action.include?('read')

    case order_by
    when 'dateModified'
      @playlists = @playlists.order(updated_at: order)
    when 'dateCreated'
      @playlists = @playlists.order(created_at: order)
    end

    @deck_id = params[:deck_id]

    case params[:deck_id]
    when /tv/
      @object_type = params[:type] || 'tvepisode'
      render 'tv', format: 'json', handlers: 'jbuilder'
    when /radio/
      @object_type = params[:type] || 'radioepisode'
      render 'radio', format: 'json', handlers: 'jbuilder'
    else
      render json: { message: 'デッキが見つかりませんでした' }, status: 404
    end
  end
  # rubocop:enable Metrics/PerceivedComplexity, Metrics/CyclomaticComplexity, Metrics/AbcSize, Metrics/MethodLength

  # rubocop:disable Metrics/AbcSize
  def show
    if params[:playlist_id].present?
      playlist_id = convert_playlist_id(params[:playlist_id])
      @playlist = Playlist.friendly.find(playlist_id)
    elsif params[:playlist_uid].present?
      playlist_uid = params[:playlist_uid].gsub('.json', '')
      @playlist = Playlist.find_by(string_id: playlist_uid)
    else
      raise ActiveRecord::RecordNotFound
    end

    @object_type = params[:type] || 'tvepisode'
    @area = params[:area]
    @request_url = request.url
    @is_min_mode = params[:is_min_mode] == '1'
  end
  # rubocop:enable Metrics/AbcSize

  def bundle
    if params[:playlist_id].present?
      playlist_id = convert_playlist_id(params[:playlist_id])
      @playlist = Playlist.friendly.find(playlist_id)
    elsif params[:playlist_uid].present?
      playlist_uid = params[:playlist_uid].gsub('.json', '')
      @playlist = Playlist.find_by(string_id: playlist_uid)
    else
      raise ActiveRecord::RecordNotFound
    end
  end

  # rubocop:disable Metrics/AbcSize
  def list_bundle
    if params[:playlist_id].present? && params[:playlist_id].match?(/^eh-/)
      playlist_id = convert_playlist_id(params[:playlist_id])
      @playlist = Playlist.friendly.find(playlist_id)
    elsif params[:playlist_id].present? && params[:playlist_id].match?(/^ts-/)
      series_id = params[:playlist_id].gsub('.json', '').gsub('ts-', '')
      @series_bundle = DlabApiClient.new.series_bundle(type: 'tv', series_id: series_id)
      render 'series_list_bundle', formats: 'json', handlers: 'jbuilder'
    elsif params[:playlist_uid].present?
      playlist_uid = params[:playlist_uid].gsub('.json', '')
      @playlist = Playlist.find_by(string_id: playlist_uid)
    else
      raise ActiveRecord::RecordNotFound
    end
  end
  # rubocop:enable Metrics/AbcSize

  def episodes
    playlist_id = convert_playlist_id(params[:playlist_id])
    @playlist = Playlist.friendly.find(playlist_id)
    @offset = (params[:offset] || 0).to_i
    @size = (params[:size] || 10).to_i
  end

  # rubocop:disable Metrics/AbcSize
  def faq_pages
    playlist_id = convert_playlist_id(params[:playlist_id])
    @playlist = Playlist.friendly.find(playlist_id)

    @faq_pages =
      @playlist.playlist_items.kept.map do |item|
        res = client.episode_faq_page(episode_id: item.episode_id)
        res[:result]
      rescue DlabApiClient::NotFound
        []
      end.flatten
    @offset = (params[:offset] || 0).to_i
    @size = (params[:size] || 10).to_i
  end

  def events
    playlist_id = convert_playlist_id(params[:playlist_id])
    @playlist = Playlist.friendly.find(playlist_id)

    @events =
      @playlist.playlist_items.kept.map do |item|
        res = client.episode_event(episode_id: item.episode_id)
        res[:result]
      rescue DlabApiClient::NotFound
        []
      end.flatten
    @offset = (params[:offset] || 0).to_i
    @size = (params[:size] || 10).to_i
  end

  def howtos
    playlist_id = convert_playlist_id(params[:playlist_id])
    @playlist = Playlist.friendly.find(playlist_id)

    @howtos =
      @playlist.playlist_items.kept.map do |item|
        res = client.episode_howto(episode_id: item.episode_id)
        res[:result]
      rescue DlabApiClient::NotFound
        []
      end.flatten
    @offset = (params[:offset] || 0).to_i
    @size = (params[:size] || 10).to_i
  end
  # rubocop:enable Metrics/AbcSize

  private

  def convert_playlist_id(playlist_id)
    converted_playlist_id = playlist_id.gsub('.json', '').gsub('eh-', '')
    converted_playlist_id.to_i
  end

  def client
    @client ||= DlabApiClient.new
  end
end
