# frozen_string_literal: true

class OpenAllSeriesDecksJob < SidekiqBaseJob
  sidekiq_options queue: 'p1'

  def perform
    SeriesDeck.all.each(&:api_state_open!)
  end
end
