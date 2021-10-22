# frozen_string_literal: true

class RelatedPlaylistsController < ApplicationController
  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
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
      res = client.get(res[:playlistUrl])
      @related_playlists << res[:result]

      while res[:nextUrl].present?
        res = client.get(res[:nextUrl])
        @related_playlists << res[:result]
      end
    rescue DlabApiBase::NotFound
      nil
    end
    @related_playlists =
      @related_playlists.flatten.uniq { |playlist| playlist[:id] }
                        .reject { |playlist| %w[series schedule].include?(playlist[:identifierGroup][:typeOfList]) }
                        .sort { |a, b| a[:identifierGroup][:typeOfList] <=> b[:identifierGroup][:typeOfList] }
                        .reverse
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
end
