# frozen_string_literal: true

class SeriesDecksController < ApiBaseController
  def index
    query = params[:query] ? SeriesDeck.name_or_admin_memo_like(params[:query]) : SeriesDeck
    case params[:api_state]
    when 'open'
      query = query.api_state_open
    when 'close'
      query = query.api_state_close
    end
    page, per = set_pagination
    @series_decks = query.page(page).per(per)
  end

  def show
    @series_deck = SeriesDeck.friendly.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { message: 'デッキが見つかりませんでした' }, status: 404 and return unless @series_deck
  end

  def create
    @series_deck = SeriesDeck.new(series_deck_params.except(:playlists))

    begin
      @series_deck.save!
      @series_deck.rebuild_playlists_to(playlist_series_ids)
    rescue DlabApiClient::NotFound, ActiveRecord::RecordInvalid
      render json: { messages: @series_deck.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @series_deck = SeriesDeck.friendly.find(params[:id])
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
    @series_deck = SeriesDeck.friendly.find(params[:id])
    @series_deck.destroy

    render json: { deleted: true }
  end

  private

  def series_deck_params
    params.require(:series_deck).permit(:name, :description, :interfix, :admin_memo, :api_state, playlists: [])
  end

  def playlist_series_ids
    series_deck_params[:playlists] || []
  end
end
