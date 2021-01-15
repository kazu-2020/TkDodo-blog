require "byebug"
require "fileutils"
require "jets"

ENV['JETS_TEST'] = "1"
ENV['JETS_ENV'] ||= "test"
# Ensures aws api never called. Fixture home folder does not contain ~/.aws/credentails
ENV['HOME'] = Jets.root.join('spec/fixtures/home').to_s

abort("The Jets environment is running in production mode!") if Jets.env == "production"
Jets.boot

require "jets/spec_helpers"
require 'active_support/testing/file_fixtures'

Dir[Jets.root.join('spec/support/**/*.rb')].each { |f| require f }

module Helpers
  def payload(name)
    JSON.load(IO.read("spec/fixtures/payloads/#{name}.json"))
  end
end

module FileFixtureSupport
  extend ActiveSupport::Concern
  include ActiveSupport::Testing::FileFixtures

  included do
    self.file_fixture_path = RSpec.configuration.file_fixture_path
  end
end

RSpec.configure do |config|
  config.include ActionDispatch::TestProcess
  config.include Helpers
  config.include FileFixtureSupport

  config.before(:suite) do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.clean_with(:truncation)
  end

  config.around(:each) do |example|
    DatabaseCleaner.cleaning do
      example.run
    end
  end

  config.after(:all) do
    FileUtils.rm_rf(Jets.root.join('public', 'uploads', 'test'))
  end

  config.add_setting :file_fixture_path, default: 'spec/fixtures/files'
  config.file_fixture_path = Jets.root.join('spec', 'fixtures')
end
