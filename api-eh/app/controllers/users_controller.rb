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
    users = users.keyword_like(params[:keyword]) if params[:keyword]
    if params[:role]
      users = users.where(roles: { name: params[:role].to_s })
      users = User.includes(:roles).where(users: { id: users.ids })
    end
    users
  end
end
