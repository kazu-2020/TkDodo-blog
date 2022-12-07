# frozen_string_literal: true

# OktaのAPI Clientクラス
class OktaClient
  def user(okta_uid)
    res = client.get "/api/v1/users/#{okta_uid}"
    return false unless res.status

    JSON.parse(res.body, symbolize_names: true)
  end

  private

  def api_endpoint
    "https://#{ENV.fetch('OKTA_DOMAIN', nil)}"
  end

  def client
    @client ||= Faraday.new(url: api_endpoint) do |faraday|
      faraday.request :url_encoded
      faraday.headers = {
        'Accept' => 'application/json',
        'Content-Type' => 'application/json',
        'Authorization' => "SSWS #{ENV.fetch('OKTA_API_TOKEN', nil)}"
      }
      logger = Logger.new($stdout)
      logger.level = Logger::ERROR if Rails.env.test?
      faraday.response :logger, logger
      faraday.adapter Faraday.default_adapter
    end
  end
end
