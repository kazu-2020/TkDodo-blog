class ApiBaseController < ApplicationController
  after_action :set_x_api_url_to_header

  DEFAULT_PAGE = 1
  DEFAULT_PER = 50

  # リクエストごとに呼び出されるclientのURLをX-API-URLとしてレスポンスヘッダに設定しています
  # https://github.com/d7lab/aw-editorialhands/issues/1535
  def set_x_api_url_to_header
    response.headers['x-api-url'] = RequestStore.store[:api_request_urls]&.join(',') || ''
  end

  # 真偽値のフラグが数値で渡ってくることがあるので、それをbooleanに変換して返します
  def cast_boolean(value)
    ActiveRecord::Type::Boolean.new.cast(value)
  end

  private

  def set_pagination
    page = [params[:page].to_i, self.class::DEFAULT_PAGE].max
    per = (params[:per] || self.class::DEFAULT_PER).to_i

    [page, per]
  end
end
