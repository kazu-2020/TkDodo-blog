# frozen_string_literal: true

class UsersController < ApiBaseController
  def index
    @users = set_users
    page, per = set_pagination
    @users = @users.page(page).per(per)
  end

  private

  def set_users
    query = User.includes(:roles)
    query = query.recent
    query = query.keyword_like(params[:keyword]) if params[:keyword]
    query.where(roles: { name: "#{params[:role]}" }) if params[:role]
  end
end
