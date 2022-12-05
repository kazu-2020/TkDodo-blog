class User < ApplicationRecord
  # @param [Object] payload decodeしたjwtのpayload
  # @return [User]
  def self.from_token_payload(payload)
    # FIXME: EHでUserを作成するかどうか
    # Payloadのsubにはemailが設定されている。oktaのuser_idはuidから取得可能
    find_by(email: payload['sub']) || create_by_token_payload!(payload)
  end

  def self.create_by_token_payload!(payload)
    res = OktaClient.new.user(payload['uid'])
    return unless res

    create!(
      email: payload['sub'],
      first_name: res.dig(:profile, :firstName),
      last_name: res.dig(:profile, :lastName),
      okta_uid: payload['uid']
    )
  end
end
