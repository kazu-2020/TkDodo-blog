module Rolable
  extend ActiveSupport::Concern

  included do
    rolify
    after_create :assign_default_role
  end

  def assign_default_role
    # FIXME: 適切なロールに修正する
    add_role(:super_admin) if roles.blank? # seedを作成するまでsuper_adminを割り当てる
  end

  def grant_super_admin!
    add_role :super_admin
  end

  def grant_user_admin!
    add_role :user_admin
  end

  def grant_playlist_admin!
    add_role :playlist_admin
  end

  def grant_deck_admin!
    add_role :deck_admin
  end

  def grant_reader!
    add_role :reader_user
  end
end
