class User < ApplicationRecord
  # NOTE: ScimUserResource の後にMixinをincludeすること
  # https://www.rubydoc.info/gems/scimitar/Scimitar/Resources/Mixin
  include ScimUserResourcable
  include Scimitar::Resources::Mixin
  include Rolable

  rolify

  has_and_belongs_to_many :roles, join_table: :users_roles

  scope :recent, -> { order(created_at: :desc) }
  scope :keyword_like, lambda { |keyword|
    where('(first_name LIKE ? OR last_name LIKE ?) OR email LIKE ?',
          "%#{sanitize_sql_like(keyword)}%",
          "%#{sanitize_sql_like(keyword)}%",
          "%#{sanitize_sql_like(keyword)}%")
  }
  # 職位区分
  # 0: Admin
  # 1: User
  enum job_class: { Admin: 0, User: 1 }

  class << self
    # @param [Object] payload decodeしたjwtのpayload
    # @return [User]
    def from_token_payload(payload)
      # Payloadのsubにはemailが, uidにoktaのuser_idが入ってくる
      find_by(email: payload['sub']) || create_by_token_payload!(payload)
    end

    def create_by_token_payload!(payload)
      res = OktaClient.new.user(payload['uid'])
      return false unless res

      create!(
        email: payload['sub'],
        man_number: res.dig(:profile, :manNumber),
        first_name: res.dig(:profile, :firstName),
        last_name: res.dig(:profile, :lastName)
      )
    end
  end
end
