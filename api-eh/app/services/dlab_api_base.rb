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

  def handle_response(response: '', url: '') # rubocop:disable Metrics/CyclomaticComplexity
    case response.status
    when 200..299
      add_url_to_request_store(url)
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

  def api_endpoint
    raise NotImplementedError, "You must implement #{self.class}##{__method__}"
  end

  def client
    @client ||= Faraday.new(url: api_endpoint) do |faraday|
      faraday.request :url_encoded
      logger = Logger.new($stdout)
      logger.level = Logger::ERROR if Rails.env.test?
      faraday.response :logger, logger
      faraday.adapter Faraday.default_adapter
    end
  end

  def add_url_to_request_store(url)
    RequestStore.store[:url] = [] if RequestStore.store[:url].nil?
    RequestStore.store[:url] << url
  end
end
