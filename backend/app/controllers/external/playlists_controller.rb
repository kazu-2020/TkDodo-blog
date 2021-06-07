# frozen_string_literal: true

class External::PlaylistsController < ApplicationController
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

  private

  def convert_playlist_id(playlist_id)
    converted_playlist_id = playlist_id.gsub('.json', '').gsub('eh-', '')
    converted_playlist_id.to_i
  end
end
