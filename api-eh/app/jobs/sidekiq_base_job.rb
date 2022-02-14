# frozen_string_literal: true

class SidekiqBaseJob
  include Sidekiq::Worker

  class << self
    def perform_async(*args)
      job_id = super(*args)
      logging(job_id, args)
      job_id
    end

    def perform_at(*args)
      job_id = super(*args)
      logging(job_id, args)
      job_id
    end

    def perform_in(*args)
      job_id = super(*args)
      logging(job_id, args)
      job_id
    end

    private

    def logging(job_id, args)
      logger = Logger.new(Rails.root.join('log', "#{Rails.env}.log"))
      logger.extend ActiveSupport::Logger.broadcast(Logger.new($stdout))
      logger.info "SidekiqJob: job_id: #{job_id}, args: #{args.inspect}"
    end
  end

  def perform(*)
    # FIXME: 変更履歴実装時に考える
    # PaperTrail.request.whodunnit = self.class.name.underscore
  end
end
