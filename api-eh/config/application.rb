require_relative 'boot'

require 'rails'
# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_job/railtie'
require 'active_record/railtie'
# require "active_storage/engine"
require 'action_controller/railtie'
require 'action_mailer/railtie'
# require "action_mailbox/engine"
# require "action_text/engine"
require 'action_view/railtie'
require 'action_cable/engine'
require 'rails/test_unit/railtie'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module EditorialHandsAPI
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.1

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    config.time_zone = 'Tokyo'

    # config.eager_load_paths << Rails.root.join("extras")
    config.eager_load_paths << Rails.root.join('app', 'services')
    config.eager_load_paths << Rails.root.join('app', 'uploaders')
    # config.eager_load_paths << Rails.root.join('app', 'helpers')

    # Don't generate system test files.
    config.generators.system_tests = nil

    config.i18n.default_locale = :ja
    config.i18n.available_locales = %i[ja en]
    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}').to_s]

    # Permit cross origin
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        resource '*',
                 headers: :any,
                 methods: %i[get post put patch delete options head]
      end
    end

    config.before_configuration do
      env_file = Rails.root.join('config', 'okta.yml')
      raise "Oktaの設定ファイルが存在しません" unless Flie.exist?(env_file)

      yaml = YAML.safe_load(File.open(env_file))
      yaml[Rails.env].each do |k, v|
        ENV[k.to_s] = v
      end
    end
  end
end
