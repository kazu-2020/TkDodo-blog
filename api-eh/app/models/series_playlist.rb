# frozen_string_literal: true

class SeriesPlaylist < ApplicationRecord
  has_many :series_deck_playlists, -> { order(position: :asc) }
  has_many :series_decks, through: :series_deck_playlists

  validates :series_id, uniqueness: { case_sensitive: true }, if: :series_id?

  def active?
    series_api_response.present?
  end

  def name
    series_api_response[:name]
  end

  def logo
    series_api_response[:logo]
  end

  def episodes(query: {})
    client.episode_from_series(type: 'tv', series_id: series_id, request_type: :l, query: query)
  rescue DlabApiClient::NotFound
    {}
  end

  private

  def client
    @client ||= DlabApiClient.new
  end

  def series_api_response
    @series_api_response ||=
      begin
        client.series(type: 'tv', series_id: series_id)
      rescue DlabApiClient::NotFound
        {}
      end
  end
end
