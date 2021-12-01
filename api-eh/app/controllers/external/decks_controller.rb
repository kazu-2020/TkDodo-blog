# frozen_string_literal: true

class External::DecksController < ApplicationController
  rescue_from ActionController::UnknownFormat, ActionView::MissingTemplate do
    render json: { message: '該当リソースは見つかりませんでした' }, status: 404
  end

  DEFAULT_AREA = 130
  DEFAULT_SIZE = 10
  DEFAULT_OFFSET = 0

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
  def show
    @request_url = request.url
    @area = params[:area]
    is_r5 = !(params[:deck_id] =~ /r5/).nil?
    @deck = Deck.find_by(area: @area, is_r5: is_r5)
    media_action = (params[:mediaAction] || '').split(',')
    @order = params[:playlistOrder] || 'desc'
    @order_by = params[:playlistOrderBy] || 'dateModified'
    @size = (params[:playlistSize] || DEFAULT_SIZE).to_i
    @offset = (params[:playlistOffset] || DEFAULT_OFFSET).to_i
    @item_size = (params[:itemSize] || DEFAULT_SIZE).to_i
    @item_offset = (params[:itemOffset] || DEFAULT_OFFSET).to_i
    @item_order = params[:itemOrder] || 'desc'

    render json: { message: 'デッキが見つかりませんでした' }, status: 404 and return unless @deck
    render json: { message: '無効なパラメーターが指定されています' }, status: 400 and return unless %w[asc desc].include?(@order)
    render json: { message: '無効なパラメーターが指定されています' }, status: 400 and return unless %w[asc desc].include?(@item_order)

    unless %w[dateModified dateCreated].include?(@order_by)
      render json: { message: '無効なパラメーターが指定されています' }, status: 400
      return
    end

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
    @order = params[:playlistOrder] || 'desc'
    @order_by = params[:playlistOrderBy] || 'dateModified'
    @size = (params[:playlistSize] || DEFAULT_SIZE).to_i
    @offset = (params[:playlistOffset] || DEFAULT_OFFSET).to_i
    @item_size = (params[:itemSize] || DEFAULT_SIZE).to_i
    @item_offset = (params[:itemOffset] || DEFAULT_OFFSET).to_i
    @item_order = params[:itemOrder] || 'desc'

    render json: { message: 'デッキが見つかりませんでした' }, status: 404 and return unless @deck
    render json: { message: '無効なパラメーターが指定されています' }, status: 400 and return unless %w[asc desc].include?(@order)
    render json: { message: '無効なパラメーターが指定されています' }, status: 400 and return unless %w[asc desc].include?(@item_order)

    unless %w[dateModified dateCreated].include?(@order_by)
      render json: { message: '無効なパラメーターが指定されています' }, status: 400
      return
    end

    case params[:deck_id]
    when /tv/
      render 'tv', format: 'json', handlers: 'jbuilder'
    else
      render json: { message: 'デッキが見つかりませんでした' }, status: 404
    end
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
end
