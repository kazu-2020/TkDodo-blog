# frozen_string_literal: true

class DlabApiBase
  class BadRequest < StandardError; end

  class Forbidden < StandardError; end

  class NotFound < StandardError; end

  class InternalServerError < StandardError; end

  class BadGateway < StandardError; end

  class ServiceUnavailable < StandardError; end

  class GatewayTimeout < StandardError; end

  class UnexpectedError < StandardError; end

  private

  # rubocop:disable Metrics/CyclomaticComplexity
  def handle_response(response)
    case response.status
    when 200..299
      JSON.parse(response.body, symbolize_names: true)
    when 400 then raise BadRequest
    when 403 then raise Forbidden
    when 404 then raise NotFound
    when 500 then raise InternalServerError
    when 502 then raise BadGateway
    when 503 then raise ServiceUnavailable
    when 504 then raise GatewayTimeout
    else
      raise UnexpectedError
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def api_endpoint
    raise NotImplementedError, "You must implement #{self.class}##{__method__}"
  end

  def client
    @client ||= Faraday.new(url: api_endpoint) do |faraday|
      faraday.request :url_encoded
      logger = Logger.new($stdout)
      logger.level = Logger::ERROR if Rails.env.test? || Rails.env.production?
      faraday.response :logger, logger
      faraday.adapter Faraday.default_adapter
    end
  end
end
