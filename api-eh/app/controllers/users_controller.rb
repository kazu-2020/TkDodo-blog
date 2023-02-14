# frozen_string_literal: true

class UsersController < ApiBaseController
  def index
    @users = filtered_users
    page, per = set_pagination
    @users = @users.page(page).per(per)
  end

  private

  def filtered_users
    users = User.includes(:roles).recent
    users = users.keyword_like(params[:keyword]) if params[:keyword].present?
    users = filtered_by_role(users) if params[:role].present?

    users
  end

  def filtered_by_role(users)
    users = users.with_role(params[:role], :any)
    User.includes(:roles).where(users: { id: users.ids }) # Userに紐づくRoleを取得するために再度取得
  end
end
