# frozen_string_literal: true

class UsersController < ApiBaseController
  def index
    @users = set_users
    page, per = set_pagination
    @users = @users.page(page).per(per)
  end

  private

  def set_users
    users = User.includes(:roles).recent
    users = users.keyword_like(params[:keyword]) if params[:keyword].present?
    if params[:role].present?
      users = users.where(roles: { name: params[:role].to_s }) # ロール名でUserを絞り込み
      users = User.includes(:roles).where(users: { id: users.ids }) # 絞り込んだUserのidに紐づくロールを全て取得
    end

    users
  end
end
