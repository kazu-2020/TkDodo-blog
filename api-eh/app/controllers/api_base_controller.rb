class ApiBaseController < ApplicationController
  after_action :set_x_api_url_to_header

  # リクエストごとに呼び出されるclientのURLをX-API-URLとしてレスポンスヘッダに設定しています
  # https://github.com/d7lab/aw-editorialhands/issues/1535
  def set_x_api_url_to_header
    return unless RequestStore.store[:api_request_urls].present?
    puts "my-debbug: api_request_urls : #{RequestStore.store[:api_request_urls]}"
    response.headers['X-Api-Url'] = RequestStore.store[:api_request_urls].join(',')
    response.headers['x-api-url'] = RequestStore.store[:api_request_urls].join(',')

    puts "my-debbug: response.headers['X-Api-Url'] : #{response.headers['X-Api-Url']}"
    puts "my-debbug: response.headers['x-api-url'] : #{response.headers['x-api-url']}"
  end
end
