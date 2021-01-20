# frozen_string_literal: true

class External::DecksController < ApplicationController
  # rubocop:disable Metrics/AbcSize
  def show
    @request_url = request.url
    @area = params[:area]
    is_r5 = !(params[:deck_id] =~ /r5/).nil?
    @deck = Deck.find_by(area: @area, is_r5: is_r5)
    @deck_id = params[:deck_id].gsub('.json', '')
    @object_type = params[:type] || 'tvepisode'
    render json: { message: 'デッキが見つかりませんでした' }, status: 404 and return unless @deck

    case params[:deck_id]
    when /visible/
      render 'visible', format: 'json', handlers: 'jbuilder'
    when /editorial/
      render 'editorial', format: 'json', handlers: 'jbuilder'
    else
      render json: { message: 'デッキが見つかりませんでした' }, status: 404
    end
  end
  # rubocop:enable Metrics/AbcSize
end
