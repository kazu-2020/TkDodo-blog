# frozen_string_literal: true

require 'sidekiq'
require 'sidekiq/web'
require 'sidekiq/worker_killer'
require 'sidekiq-scheduler/web'

Sidekiq.configure_server do |config|
  # sidekiq_scheduler.ymlを読み込む
  config.on(:startup) do
    Sidekiq.schedule = YAML.load_file(File.expand_path('../sidekiq_scheduler.yml', __dir__))
    SidekiqScheduler::Scheduler.instance.reload_schedule!
  end

  # config.error_handlers << proc { |ex, ctx_hash| SidekiqErrorNotify.call(ex, ctx_hash) }
  config.server_middleware do |chain|
    # メモリ使用率が80%を超えた場合Workerをkill (1600 / 2048 ≒ 80%)
    chain.add Sidekiq::WorkerKiller, max_rss: 1600
  end
end

Sidekiq.strict_args!(:warn)
