class User < ApplicationRecord
  # NOTE: ScimUserResource の後にMixinをincludeすること
  # https://www.rubydoc.info/gems/scimitar/Scimitar/Resources/Mixin
  include ScimUserResourcable
  include Scimitar::Resources::Mixin
  include Rolable

  rolify

  after_create :assign_default_role

  has_and_belongs_to_many :roles, join_table: :users_roles

  scope :recent, -> { order(updated_at: :desc) }
  scope :keyword_like, lambda { |keyword|
                         where('(first_name LIKE ? OR last_name LIKE ?) OR email LIKE ?',
                               "%#{keyword}%", "%#{keyword}%", "%#{keyword}%")
                       }

  # @param [Object] payload decodeしたjwtのpayload
  # @return [User]
  def self.from_token_payload(payload)
    # Payloadのsubにはemailが, uidにoktaのuser_idが入ってくる
    find_by(email: payload['sub']) || create_by_token_payload!(payload)
  end

  def self.create_by_token_payload!(payload)
    res = OktaClient.new.user(payload['uid'])
    return false unless res

    create!(
      email: payload['sub'],
      first_name: res.dig(:profile, :firstName),
      last_name: res.dig(:profile, :lastName),
      okta_uid: payload['uid']
    )
  end
end
