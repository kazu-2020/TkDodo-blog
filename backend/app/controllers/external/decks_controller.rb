# frozen_string_literal: true

class External::DecksController < ApplicationController
  # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
  def show
    @request_url = request.url
    @area = params[:area]
    @deck = Deck.find_by(area: @area, is_r5: true)
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
  # rubocop:enable Metrics/MethodLength, Metrics/AbcSize
end
