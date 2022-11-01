# frozen_string_literal: true

class SeriesDecksController < ApiBaseController
  before_action :set_pagination, only: [:index]

  DEFAULT_PAGE = 1
  DEFAULT_PER = 50

  def index
    query = params[:query] ? SeriesDeck.name_or_admin_memo_like(params[:query]) : SeriesDeck
    case params[:api_state]
    when 'open'
      query = query.api_state_open
    when 'close'
      query = query.api_state_close
    end
    @series_decks = query.page(@page).per(@per)
  end

  def show
    @series_deck = SeriesDeck.find_by(id: params[:id])
    render json: { message: 'デッキが見つかりませんでした' }, status: 404 and return unless @series_deck
  end

  def create
    @series_deck = SeriesDeck.new(series_deck_params.except(:playlists))

    begin
      @series_deck.save!

      playlist_series_ids = series_deck_params[:playlists] || []
      @series_deck.rebuild_playlists_to(playlist_series_ids)
    rescue DlabApiClient::NotFound, ActiveRecord::RecordInvalid
      render json: { messages: @series_deck.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @series_deck = SeriesDeck.find_by(id: params[:id])
    if @series_deck.update(series_deck_params.except(:playlists))
      if cast_boolean(params[:enable_list_update])
        @series_deck.rebuild_playlists_to(playlist_series_ids)
      else
        @series_deck.touch # nested_attributes だけ更新された場合のための処理
      end
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
    params.require(:series_deck).permit(:name, :description, :interfix, :admin_memo, :api_state, playlists: [])
  end

  def set_pagination
    @page = [params[:page].to_i, DEFAULT_PAGE].max
    @per = (params[:per] || DEFAULT_PER).to_i
  end

  def playlist_series_ids
    series_deck_params[:playlists] || []
  end
end
