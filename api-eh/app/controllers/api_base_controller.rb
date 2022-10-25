class ApiBaseController < ApplicationController
  # レスポンスヘッダにX-API-URLを設定するため、各コントローラーで呼び出してください
  # https://github.com/d7lab/aw-editorialhands/issues/1535
  def set_x_api_url_to_header
    response.headers['X-Api-Url'] =
      (RequestStore.store[:api_request_urls].join(',') if RequestStore.store[:api_request_urls].present?)
  end
end
