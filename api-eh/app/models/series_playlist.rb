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

  def videos
    series_api_response[:videos]
  end

  def episodes(query: {})
    client.episode_from_series(type: 'tv', series_id: series_id, request_type: :l, query: query)
  rescue DlabApiClient::NotFound
    {}
  end

  def episode_count
    series_types_api_response[:tvepisode]&.[](:count) || 0
  end

  def how_to_count
    series_types_api_response[:howto]&.[](:count) || 0
  end

  def event_count
    series_types_api_response[:event]&.[](:count) || 0
  end

  def faq_page_count
    series_types_api_response[:faqpage]&.[](:count) || 0
  end

  def recipe_count
    series_types_api_response[:recipe]&.[](:count) || 0
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

  def series_types_api_response
    @series_types_api_response ||=
      begin
        client.series_ll_bundle_types(type: 'tv', series_id: series_id)
      rescue DlabApiClient::NotFound
        {}
      end
  end
end
