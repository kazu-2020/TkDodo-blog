# frozen_string_literal: true

class DestroyImageJob < SidekiqBaseJob
  sidekiq_options queue: 'p7'

  def perform(attacher_class, data)
    super
    attacher_class = Object.const_get(attacher_class)

    attacher = attacher_class.from_data(data)
    attacher.destroy
  end
end
