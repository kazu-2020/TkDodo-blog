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
    users = User.search_by_keyword(users: users, keyword: params[:keyword]) if params[:keyword].present?
    users = User.search_by_role(users: users, role: params[:role]) if params[:role].present?

    users
  end
end
