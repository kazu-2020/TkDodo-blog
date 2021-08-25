# frozen_string_literal: true

class External::PlaylistsController < ApplicationController
  rescue_from ActionController::UnknownFormat, ActionView::MissingTemplate, ActiveRecord::RecordNotFound do
    render json: { message: '該当リソースは見つかりませんでした' }, status: 404
  end

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

  # rubocop:disable Metrics/AbcSize
  def episodes
    if params[:playlist_id].present?
      playlist_id = convert_playlist_id(params[:playlist_id])
      @playlist = Playlist.friendly.find(playlist_id)
    elsif params[:playlist_uid].present?
      playlist_uid = params[:playlist_uid].gsub('.json', '')
      @playlist = Playlist.find_by!(string_id: playlist_uid)
    else
      raise ActiveRecord::RecordNotFound
    end

    @offset = (params[:offset] || 0).to_i
    @size = (params[:size] || 10).to_i
  end
  # rubocop:enable Metrics/AbcSize

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def faq_pages
    if params[:playlist_id].present?
      playlist_id = convert_playlist_id(params[:playlist_id])
      @playlist = Playlist.friendly.find(playlist_id)
    elsif params[:playlist_uid].present?
      playlist_uid = params[:playlist_uid].gsub('.json', '')
      @playlist = Playlist.find_by!(string_id: playlist_uid)
    else
      raise ActiveRecord::RecordNotFound
    end

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
    if params[:playlist_id].present?
      playlist_id = convert_playlist_id(params[:playlist_id])
      @playlist = Playlist.friendly.find(playlist_id)
    elsif params[:playlist_uid].present?
      playlist_uid = params[:playlist_uid].gsub('.json', '')
      @playlist = Playlist.find_by!(string_id: playlist_uid)
    else
      raise ActiveRecord::RecordNotFound
    end

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
    if params[:playlist_id].present?
      playlist_id = convert_playlist_id(params[:playlist_id])
      @playlist = Playlist.friendly.find(playlist_id)
    elsif params[:playlist_uid].present?
      playlist_uid = params[:playlist_uid].gsub('.json', '')
      @playlist = Playlist.find_by!(string_id: playlist_uid)
    else
      raise ActiveRecord::RecordNotFound
    end

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
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

  private

  def convert_playlist_id(playlist_id)
    converted_playlist_id = playlist_id.gsub('.json', '').gsub('eh-', '')
    converted_playlist_id.to_i
  end

  def client
    @client ||= DlabApiClient.new
  end
end
