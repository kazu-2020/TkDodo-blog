# frozen_string_literal: true

class SeriesPlaylist < ApplicationRecord
  has_many :series_deck_playlists, -> { order(position: :asc) }
  has_many :series_decks, through: :series_deck_playlists

  validates :series_id, uniqueness: { case_sensitive: true }, presence: true, if: :series_id?
  validates :string_id, uniqueness: { case_sensitive: true }, presence: true
  validate :series_id_digits_must_be_10
  validate :series_id_should_be_only_alphanumeric

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

  def tvepisode_count
    series_types_api_response[:tvepisode]&.[](:count) || 0
  end

  def howto_count
    series_types_api_response[:howto]&.[](:count) || 0
  end

  def event_count
    series_types_api_response[:event]&.[](:count) || 0
  end

  def faqpage_count
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

  def series_id_digits_must_be_10
    return if series_id.blank?
    return if series_id.to_s.size == 10

    errors.add(:series_id, 'シリーズIDは10桁で入力してください')
  end

  def series_id_should_be_only_alphanumeric
    return if series_id.blank?
    return if series_id.to_s.match?(%r{\A[A-Z0-9]+\z})

    errors.add(:series_id, 'シリーズIDは半角大文字英字と半角数字で入力してください')
  end
end
