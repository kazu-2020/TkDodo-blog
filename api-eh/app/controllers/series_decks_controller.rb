# frozen_string_literal: true

class SeriesDecksController < ApplicationController
  before_action :set_pagination, only: [:index]

  DEFAULT_PAGE = 1
  DEFAULT_PER  = 50

  def index
    @series_decks = SeriesDeck.page(@page).per(@per)
  end

  def show
    @series_deck = SeriesDeck.find_by(id: params[:id])
    render json: { message: 'デッキが見つかりませんでした' }, status: 404 and return unless @series_deck
  end

  def update
    @series_deck = SeriesDeck.find_by(id: params[:id])
    if @series_deck.update(series_deck_params)
      if params[:enable_list_update]
        playlist_series_ids = params.require(:series_deck).permit(playlists: [])[:playlists] || []
        @series_deck.rebuild_playlists_to(playlist_series_ids)
      end

      @series_deck.touch # nested_attributes だけ更新された場合のための処理
    else
      render json: { messages: @series_deck.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @series_deck = SeriesDeck.find(params[:id])
    @series_deck.destroy

    render json: { deleted: true }
  end

  private

  def series_deck_params
    params.require(:series_deck).permit(:name, :description, :interfix, :admin_memo, :playlists)
  end

  def set_pagination
    @page = [params[:page].to_i, DEFAULT_PAGE].max
    @per  = (params[:per] || DEFAULT_PER).to_i
  end
end
