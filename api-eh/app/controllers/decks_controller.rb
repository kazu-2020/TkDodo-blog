# frozen_string_literal: true

class DecksController < ApplicationController
  before_action :set_pagination, only: [:index]

  DEFAULT_PAGE = 1
  DEFAULT_PER  = 50

  def index
    @decks = Deck.page(@page).per(@per)
  end

  def show
    @deck = Deck.find_by(id: params[:id])
    render json: { message: 'デッキが見つかりませんでした' }, status: 404 and return unless @deck
  end

  def update
    @deck = Deck.find_by(id: params[:id])
    if @deck.update(deck_params)
      if params[:enable_list_update]
        playlist_ids = params.require(:deck).permit(playlists: [])[:playlists] || []
        @deck.rebuild_playlists_to(playlist_ids)
      end

      @deck.touch # nested_attrubuites だけ更新された場合のための処理
    else
      render json: { messages: @deck.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def playlists
    @deck = Deck.find_by(id: params[:id])

    page = (params[:page] || 1).to_i
    per  = (params[:per]  || 10).to_i
    @playlists = @deck.playlists.page(page).per(per)
  end

  private

  def deck_params
    params.require(:deck).permit(:name, :description, :admin_memo, :playlists,
                                 deck_same_as_attributes: %i[id name url _destroy])
  end

  def set_pagination
    @page = [params[:page].to_i, DEFAULT_PAGE].max
    @per  = (params[:per] || DEFAULT_PER).to_i
  end
end
