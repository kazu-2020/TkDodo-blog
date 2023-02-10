# frozen_string_literal: true

class UsersController < ApiBaseController
  def index
    @users = set_users
    page, per = set_pagination
    @users = @users.page(page).per(per)
  end

  private

  def set_users
    query = User.includes(:roles).recent
    query = query.keyword_like(params[:keyword]) if params[:keyword]
    if params[:role]
      query = query.where(roles: { name: "#{params[:role]}" })
      query = User.includes(:roles).where(users: {id: query.ids})
    end
    query
  end
end
