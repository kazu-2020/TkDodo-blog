class ApiBaseController < ApplicationController
  after_action :set_x_api_url_to_header

  # リクエストごとに呼び出されるclientのURLをX-API-URLとしてレスポンスヘッダに設定しています
  # https://github.com/d7lab/aw-editorialhands/issues/1535
  def set_x_api_url_to_header
    puts "my-debbug: api_request_urls] : #{RequestStore.store[:api_request_urls]}"
    Logger.new($stdout).info "my-debbug: api_request_urls] : #{RequestStore.store[:api_request_urls]}"
    return unless RequestStore.store[:api_request_urls].present?

    response.headers['X-Api-Url'] = RequestStore.store[:api_request_urls].join(',')
  end
end
