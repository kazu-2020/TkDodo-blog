# frozen_string_literal: true

class External::DecksController < ApplicationController
  rescue_from ActionController::UnknownFormat, ActionView::MissingTemplate do
    render json: { message: '該当リソースは見つかりませんでした' }, status: 404
  end

  DEFAULT_AREA = 130
  DEFAULT_SIZE = 10

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
  def show
    @request_url = request.url
    @area = params[:area]
    is_r5 = !(params[:deck_id] =~ /r5/).nil?
    @deck = Deck.find_by(area: @area, is_r5: is_r5)
    media_action = (params[:mediaAction] || '').split(',')
    order = params[:order] || 'desc'
    order_by = params[:orderBy] || 'dateModified'
    @size = (params[:playlistSize] || DEFAULT_SIZE).to_i

    render json: { message: 'デッキが見つかりませんでした' }, status: 404 and return unless @deck
    render json: { message: '無効なパラメーターが指定されています' }, status: 400 and return unless %w[asc desc].include?(order)

    unless %w[dateModified dateCreated].include?(order_by)
      render json: { message: '無効なパラメーターが指定されています' }, status: 400
      return
    end

    @playlists =
      if params[:theme_genre_code]
        @deck.playlists.draft.where(theme_genre_code: params[:theme_genre_code])
      else
        @deck.playlists.draft
      end
    @playlists = @playlists.has_article if media_action.include?('read')
    @playlists = @playlists.has_visible_items if media_action.include?('watch')
    @object_type = params[:type] || 'tvepisode'

    case order_by
    when 'dateModified'
      @playlists = @playlists.order(updated_at: order)
    when 'dateCreated'
      @playlists = @playlists.order(created_at: order)
    end

    @deck_id = params[:deck_id].gsub('.json', '')

    case params[:deck_id]
    when /tv/
      render 'recommend_tv', format: 'json', handlers: 'jbuilder'
    else
      render json: { message: 'デッキが見つかりませんでした' }, status: 404
    end
  end

  def show_migrated
    @request_url = request.url
    @area = DEFAULT_AREA
    is_r5 = !(params[:deck_id] =~ /r5/).nil?
    @deck = Deck.find_by(area: @area, is_r5: is_r5)
    media_action = (params[:mediaAction] || '').split(',')
    order = params[:order] || 'desc'
    order_by = params[:orderBy] || 'dateModified'
    @size = (params[:playlistSize] || DEFAULT_SIZE).to_i

    render json: { message: 'デッキが見つかりませんでした' }, status: 404 and return unless @deck
    render json: { message: '無効なパラメーターが指定されています' }, status: 400 and return unless %w[asc desc].include?(order)

    unless %w[dateModified dateCreated].include?(order_by)
      render json: { message: '無効なパラメーターが指定されています' }, status: 400
      return
    end

    @playlists = @deck.playlists.draft
    @playlists = @playlists.has_article if media_action.include?('read')
    @playlists = @playlists.has_visible_items if media_action.include?('watch')

    case order_by
    when 'dateModified'
      @playlists = @playlists.order(updated_at: order)
    when 'dateCreated'
      @playlists = @playlists.order(created_at: order)
    end

    @deck_id = params[:deck_id].gsub('.json', '')

    case params[:deck_id]
    when /tv/
      @object_type = params[:type] || 'tvepisode'
      render 'tv', format: 'json', handlers: 'jbuilder'
    else
      render json: { message: 'デッキが見つかりませんでした' }, status: 404
    end
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
end
