class ApiBaseController < ApplicationController
  after_action :set_x_api_url_to_header

  # リクエストごとに呼び出されるclientのURLをX-API-URLとしてレスポンスヘッダに設定しています
  # https://github.com/d7lab/aw-editorialhands/issues/1535
  def set_x_api_url_to_header
    response.headers['x-api-url'] = RequestStore.store[:api_request_urls]&.join(',') || ''
  end
end
