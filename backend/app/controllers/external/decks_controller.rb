# frozen_string_literal: true

class External::DecksController < ApplicationController
  def show
    @request_url = request.url
    @area = params[:area]
    @deck = Deck.find_by(area: @area)
    @deck_id = params[:deck_id].gsub('.json', '')
    @object_type = params[:type] || 'tvepisode'
    render json: { message: 'デッキが見つかりませんでした' }, status: 404 and return unless @deck

    case params[:deck_id]
    when /visible/
      @identifier_group_deck_id = "recommend-visible-r5-#{@area}"
      render 'visible', format: 'json', handlers: 'jbuilder'
    when /editorial/
      @identifier_group_deck_id = "recommend-editorial-r5-#{@area}"
      render 'editorial', format: 'json', handlers: 'jbuilder'
    else
      render json: { message: 'デッキが見つかりませんでした' }, status: 404
    end
  end
end
