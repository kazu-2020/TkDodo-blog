# frozen_string_literal: true

class SeriesDecksController < ApplicationController
  before_action :set_pagination, only: [:index]

  DEFAULT_PAGE = 1
  DEFAULT_PER  = 50

  def index
    @series_decks = SeriesDeck.page(@page).per(@per)
  end

  def destroy
    @series_deck = SeriesDeck.find(params[:id])
    @series_deck.destroy

    render json: { deleted: true }
  end

  private

  def series_deck_params
    params.require(:deck).permit(:name, :description, :interfix, :admin_memo, :playlists, :api_state,
                                 deck_same_as_attributes: %i[id name url _destroy])
  end

  def set_pagination
    @page = [params[:page].to_i, DEFAULT_PAGE].max
    @per  = (params[:per] || DEFAULT_PER).to_i
  end
end
