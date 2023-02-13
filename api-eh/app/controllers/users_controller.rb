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
    users = users.keyword_like(users, params[:keyword]) if params[:keyword].present?
    users = User.joins(:roles).where(roles: { name: params[:role].to_s }) if params[:role].present?

    users
  end
end
