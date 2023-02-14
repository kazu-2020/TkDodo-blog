# frozen_string_literal: true

class UsersController < ApiBaseController
  def index
    @users = filtered_users
    page, per = set_pagination
    @users = @users.page(page).per(per)
  end

  private

  def filtered_users
    users = User.preload(:roles).recent
    users = users.keyword_like(params[:keyword]) if params[:keyword].present?
    users = users.with_role(params[:role], :any) if params[:role].present?

    users
  end
end
