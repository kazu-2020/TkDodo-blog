# frozen_string_literal: true

class Embed::EpisodesController < EmbedController
  def show
    episode_id = embed_episode_params[:episode_id]
    @episode_data = DlabApiClient.new(api_endpoint: 'https://api.nr.nhk.jp')
                                 .episode(type: 'tv', episode_id: episode_id, query: { ignoreRange: false })

    render 'embed/not_found', status: :not_found and return if @episode_data.blank?

    @view_component = if embed_episode_params[:layout_pattern] == Embed::LayoutPattern::LARGE_IMAGE
                        Embed::Episode::LargeImageComponent.new(episode_data: @episode_data,
                                                                height: height)

                      else
                        Embed::Episode::SummaryComponent.new(episode_data: @episode_data,
                                                             height: height)
                      end
  rescue DlabApiBase::NotFound
    render 'embed/not_found', status: :not_found
  end

  private

  def height
    layout_pattern = embed_episode_params[:layout_pattern]&.to_sym || :summary
    embed_episode_params[:height] || Embed::LayoutPattern::DEFAULT_SIZE[layout_pattern][:height]
  end

  def embed_episode_params
    params.permit(:series_id, :episode_id, :height, :layout_pattern)
  end
end
