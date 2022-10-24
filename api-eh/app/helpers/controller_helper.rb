module ControllerHelper
  # レスポンスヘッダにX-API-URLを設定するため、各コントローラーで呼び出すようにしてください
  # https://github.com/d7lab/aw-editorialhands/issues/1535
  def set_x_api_url_to_header
    response.headers['X-Api-Url'] = (RequestStore.store[:url].join(',') if RequestStore.store[:url].present?)
  end
end
