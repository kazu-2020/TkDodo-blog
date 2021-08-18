# frozen_string_literal: true

class External::DecksController < ApplicationController
  rescue_from ActionController::UnknownFormat, ActionView::MissingTemplate do
    render json: { message: '該当リソースは見つかりませんでした' }, status: 404
  end

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
  def show
    @request_url = request.url
    @area = params[:area]
    is_r5 = !(params[:deck_id] =~ /r5/).nil?
    @deck = Deck.find_by(area: @area, is_r5: is_r5)
    consume_action = (params[:consumeAction] || '').split(',')
    order = params[:order] || 'desc'
    order_by = params[:orderBy] || 'dateModified'

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
    @playlists = @playlists.has_article if consume_action.include?('read')
    case order_by
    when 'dateModified'
      @playlists = @playlists.order(updated_at: order)
    when 'dateCreated'
      @playlists = @playlists.order(created_at: order)
    end

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
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
end
