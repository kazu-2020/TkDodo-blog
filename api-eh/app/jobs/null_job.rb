# frozen_string_literal: true

class NullJob < SidekiqBaseJob
  sidekiq_options queue: 'low'

  def perform
    Sidekiq.❨╯°□°❩╯︵┻━┻ # rubocop:disable Naming/AsciiIdentifiers
  end
end
