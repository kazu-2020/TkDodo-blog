# frozen_string_literal: true

module D65ApiCallable
  extend ActiveSupport::Concern

  included do
    rescue_from DlabExperimentalApiClient::NotFound do |exception|
      render json: { message: 'プレイリストが見つかりませんでした', error: exception.message }, status: 404
    end
    rescue_from DlabExperimentalApiClient::BadRequest, DlabExperimentalApiClient::Forbidden,
                DlabExperimentalApiClient::InternalServerError, DlabExperimentalApiClient::BadGateway,
                DlabExperimentalApiClient::ServiceUnavailable, DlabExperimentalApiClient::GatewayTimeout do |exception|
      render json: { message: 'プレイリストの取得ができませんでした', error: exception.message }, status: 400
    end
  end
end
