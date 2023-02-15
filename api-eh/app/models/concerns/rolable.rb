module Rolable
  extend ActiveSupport::Concern

  included do
    rolify
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
