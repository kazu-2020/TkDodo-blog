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

  private

  def client
    @client ||= DlabApiClient.new
  end

  def series_api_response
    @response ||=
      begin
        client.series(type: 'tv', series_id: series_id)
      rescue DlabApiClient::NotFound
        {}
      end
  end
end
