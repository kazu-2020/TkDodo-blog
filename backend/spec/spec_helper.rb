require "byebug"
require "fileutils"
require "jets"

ENV['JETS_TEST'] = "1"
ENV['JETS_ENV'] = "test"
# Ensures aws api never called. Fixture home folder does not contain ~/.aws/credentails
ENV['HOME'] = Jets.root.join('spec/fixtures/home').to_s

abort("The Jets environment is running in production mode!") if Jets.env == "production"
Jets.boot

require "jets/spec_helpers"

Dir[Jets.root.join('spec/support/**/*.rb')].each { |f| require f }

module Helpers
  def payload(name)
    JSON.load(IO.read("spec/fixtures/payloads/#{name}.json"))
  end
end

RSpec.configure do |config|
  config.include ActionDispatch::TestProcess
  config.include Helpers

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
end
