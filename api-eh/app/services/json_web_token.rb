# frozen_string_literal: true

require 'net/http'
require 'uri'

class JsonWebToken
  def self.verify(token)
    JWT.decode(token, nil, true, { algorithms: ['RS256'], jwks: { keys: jwks_keys } })
  end

  def self.jwks_keys
    okta_keys_url = "https://#{ENV.fetch('OKTA_DOMAIN', nil)}/oauth2/default/v1/keys"
    jwks_raw = Net::HTTP.get URI(okta_keys_url)
    Array(JSON.parse(jwks_raw)['keys'])
  end
end
