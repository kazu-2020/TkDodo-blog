# frozen_string_literal: true

class UsersController < ApiBaseController
  def index
    @users = set_users
    page, per = set_pagination
    @users = @users.page(page).per(per)
  end

  private

  def set_users
    query = User.all
    query = query.recent
    query.keyword_like(params[:keyword]) if params[:keyword]
  end
end
