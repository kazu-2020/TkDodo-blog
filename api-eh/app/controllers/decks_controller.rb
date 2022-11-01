# frozen_string_literal: true

class DecksController < ApiBaseController
  before_action :set_pagination, only: [:index]

  DEFAULT_PAGE = 1
  DEFAULT_PER = 50

  def index
    query = params[:query].present? ? Deck.name_or_admin_memo_like(params[:query]) : Deck
    case params[:api_state]
    when 'open'
      query = query.api_state_open
    when 'close'
      query = query.api_state_close
    end
    @decks = query.page(@page).per(@per)
  end

  def show
    @deck = Deck.find_by(id: params[:id])
    render json: { message: 'デッキが見つかりませんでした' }, status: 404 and return unless @deck
  end

  def create
    @deck = Deck.new(deck_params.except(:playlists))
    begin
      @deck.save!
      @deck.rebuild_playlists_to(playlist_ids)
    rescue DlabApiClient::NotFound, ActiveRecord::RecordInvalid
      render json: { messages: @deck.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @deck = Deck.find_by(id: params[:id])
    if @deck.update(deck_params.except(:playlists))
      if cast_boolean(params[:enable_list_update])
        @deck.rebuild_playlists_to(playlist_ids)
      else
        @deck.touch # nested_attributes だけ更新された場合のための処理
      end
    else
      render json: { messages: @deck.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @deck = Deck.find(params[:id])
    @deck.destroy
    render json: { deleted: true }
  end

  def playlists
    @deck = Deck.find_by(id: params[:id])
    page = (params[:page] || 1).to_i
    per = (params[:per] || 10).to_i
    @playlists = @deck.playlists.page(page).per(per)
  end

  private

  def deck_params
    params.require(:deck).permit(:name, :description, :interfix, :admin_memo, :api_state,
                                 playlists: [], deck_same_as_attributes: %i[id name url _destroy])
  end

  def set_pagination
    @page = [params[:page].to_i, DEFAULT_PAGE].max
    @per = (params[:per] || DEFAULT_PER).to_i
  end

  def playlist_ids
    deck_params[:playlists] || []
  end
end
