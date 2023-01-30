# frozen_string_literal: true

require 'net/http'
require 'uri'

class JsonWebToken
  def self.verify(token)
    JWT.decode(token, nil, true, { algorithms: ['RS256'], jwks: { keys: OktaClient.new.jwks_keys } })
  end
end
