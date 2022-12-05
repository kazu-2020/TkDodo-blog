# okta認証で保護するエンドポイントのcontrollerにincludeする
module Secured
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request!
  end

  def current_user
    @user
  end

  private

  def authenticate_request!
    @user = User.from_token_payload(auth_token)
  rescue JWT::VerificationError, JWT::DecodeError
    render json: { errors: ['Not Authenticated'] }, status: :unauthorized
  end

  def http_token
    request.headers['Authorization'].split.last if request.headers['Authorization'].present?
  end

  def auth_token
    decoded_token = JsonWebToken.verify(http_token)
    decoded_token.instance_of?(Array) ? decoded_token[0] : decoded_token
  end
end
