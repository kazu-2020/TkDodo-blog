# frozen_string_literal: true

class DecksController < ApplicationController
  def index
    @decks = Deck.all
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
    params.require(:deck).permit(:name, :description, :playlists)
  end
end
