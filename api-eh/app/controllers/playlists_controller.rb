# frozen_string_literal: true

class PlaylistsController < ApplicationController
  before_action :set_playlist, only: %i[update destroy actors_and_contributors]
  before_action :set_pagination, only: [:index]

  DEFAULT_PAGE = 1
  DEFAULT_PER  = 50

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def index
    @playlists = if params[:deck_id].present?
                   deck = Deck.find_by(id: params[:deck_id])
                   deck.playlists
                 elsif params[:area].present?
                   deck = Deck.find_by(area: params[:area], is_r5: true)
                   deck.playlists
                 else
                   Playlist.original
                 end
    case params[:api_state]
    when 'open'
      @playlists = @playlists.api_state_open
    when 'close'
      @playlists = @playlists.api_state_close
    end
    @playlists = @playlists.name_like(params[:query]) if params[:query]
    @playlists = @playlists.recent.page(@page).per(@per)
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

  def show
    @playlist = Playlist.friendly.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { messages: "#{params[:id]}は見つかりませんでした" }, status: :not_found
  end

  def create
    @playlist = Playlist.new(converted_params)

    begin
      @playlist.save!
      if params[:enable_list_update]
        items = params.require(:playlist).permit(items: [])[:items] || []
        @playlist.rebuild_episode_list_to(items)
      end
    rescue DlabApiClient::NotFound, ActiveRecord::RecordInvalid
      render json: { messages: @playlist.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @playlist.update(converted_params)
      if params[:enable_list_update]
        items = params.require(:playlist).permit(items: [])[:items] || []
        @playlist.rebuild_episode_list_to(items)
      end

      @playlist.touch # nested_attrubuites だけ更新された場合のための処理
    else
      render json: { messages: @playlist.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @playlist.destroy
    render json: { deleted: true }
  end

  def upload_article_image_by_url
    playlist =
      begin
        Playlist.friendly.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        nil
      end

    article_image = ArticleImage.new(playlist: playlist)
    attacher = article_image.image_attacher
    downloaded_file = ArticleImageUploader.remote_url(params['url'])
    attacher.attach(downloaded_file)

    if article_image.save
      render json: { success: 1, file: { url: article_image.image.id } }
    else
      head :bad_request
    end
  end

  def upload_article_image_by_file
    playlist =
      begin
        Playlist.friendly.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        nil
      end

    article_image = ArticleImage.new(playlist: playlist)
    attacher = article_image.image_attacher
    attacher.attach(image_param)

    if article_image.save
      render json: { success: 1, file: { url: article_image.image.id } }
    else
      head :bad_request
    end
  end

  def actors_and_contributors; end

  private

  def set_playlist
    @playlist = Playlist.friendly.find(params[:id])
  end

  def playlist_params
    params.require(:playlist)
          .permit(:name, :detailed_name_ruby, :description, :headline,
                  :detailed_catch, :format_genre_code, :theme_genre_code,
                  :logo_image, :eyecatch_image, :hero_image,
                  :remove_logo_image, :remove_eyecatch_image, :remove_hero_image,
                  :selected_palette, :primary_light_color, :primary_dark_color,
                  :text_light_color, :text_dark_color, :link_light_color, :link_dark_color,
                  :active_episode, :active_article, :active_faq_page, :active_how_to, :active_event, :active_item_list,
                  :reserve_publish_time_at, :reserve_finish_time_at, :layout_pattern, :publish_level,
                  :original_series_id, :alias_id, :marked_header, :editor_data, :marked_footer,
                  :author_type, :author_name, :publisher_type, :publisher_name, :api_state,
                  same_as_attributes: %i[id name url _destroy], citations_attributes: %i[id name url _destroy],
                  playlist_items_attributes: %i[episode_id],
                  keywords: [], hashtags: [])
  end

  def set_pagination
    @page = [params[:page].to_i, DEFAULT_PAGE].max
    @per  = (params[:per] || DEFAULT_PER).to_i
  end

  # FIXME: 変更予定 後ほどふさわしい場所に定義します
  def converted_params
    params = playlist_params.except(:logo_image, :eyecatch_image, :hero_image)
    %i[logo_image eyecatch_image hero_image].each do |key|
      params[key] = image_from_base64(playlist_params[key]) if playlist_params[key]
    end

    params[:editor_data] = JSON.parse(params[:editor_data]) if params[:editor_data].present?

    params
  end

  def image_param
    params[:image]
  end

  # FIXME: 変更予定 後ほどふさわしい場所に定義します
  def image_from_base64(base64_image)
    filename = SecureRandom.alphanumeric
    content_type, string_data = base64_image.match(/data:(.*?);(?:.*?),(.*)$/).captures
    extension = content_type.split('/').second
    tempfile = Tempfile.new(filename)
    tempfile.binmode
    tempfile << Base64.decode64(string_data)
    tempfile.rewind
    file = { filename: [filename, extension].join('.'), type: content_type, tempfile: tempfile }

    ActionDispatch::Http::UploadedFile.new(file)
  end
end
