# frozen_string_literal: true

class DecksController < ApplicationController
  def index
    @decks = Deck.all
  end

  def playlists
    @deck = Deck.find_by(id: params[:id])

    page = (params[:page] || 1).to_i
    per  = (params[:per]  || 10).to_i
    @playlists = @deck.playlists.page(page).per(per)
  end
end
