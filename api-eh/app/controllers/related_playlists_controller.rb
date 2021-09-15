# frozen_string_literal: true

class RelatedPlaylistsController < ApplicationController
  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def index
    episode_ids = params[:episode_ids].split(',')
    keywords = params[:keywords].split(',')
    client = DlabR65ApiClient.new

    @related_playlists = []
    episode_ids.each do |episode_id|
      res = client.episode_playlist(episode_id)
      @related_playlists << res[:result]
    rescue DlabApiBase::NotFound
      nil
    end
    keywords.each do |keyword|
      res = client.keyword_playlist(keyword)
      @related_playlists << res[:playlists]
    rescue DlabApiBase::NotFound
      nil
    end
    @related_playlists =
      @related_playlists.flatten.uniq { |playlist| playlist[:id] }
                        .sort { |a, b| a[:identifierGroup][:typeOfList] <=> b[:identifierGroup][:typeOfList] }
                        .reverse
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength
end
