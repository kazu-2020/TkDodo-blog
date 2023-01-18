# frozen_string_literal: true

class Ability
  include CanCan::Ability

  MANAGER_ACTIONS = %i[read update destroy assign publish].freeze   # 代表承認者
  APPROVER_ACTIONS = %i[read update publish].freeze                 # 承認者
  EDITOR_ACTIONS = %i[read update].freeze                           # 入力者
  READER_ACTION = %i[read].freeze                                   # 閲覧者
  SYSTEM_ROLES_ABILITIES = {
    # システム管理者
    super_admin: [{ action: :manage, subject: :all }],
    # ユーザー管理者
    user_admin: [
      { action: :manage, subject: User },
      { action: :manage, subject: Announcement }
    ],
    # プレイリスト管理者
    playlist_admin: [
      { action: :manage, subject: Playlist },
      { action: :read, subject: PlaylistItem },
      { action: :manage, subject: 'Episode' },
      { action: :manage, subject: Announcement }
    ],
    # デッキ管理者
    deck_admin: [
      { action: :manage, subject: Deck },
      { action: :manage, subject: SeriesDeck },
      { action: %i[episodes search], subject: SeriesPlaylist },
      { action: :manage, subject: Announcement }
    ],
    # 閲覧者
    reader_user: [
      { action: %i[read actors_and_contributors bundle_items], subject: Playlist },
      { action: :read, subject: PlaylistItem },
      { action: :read, subject: Deck },
      { action: :read, subject: SeriesDeck },
      { action: :episodes, subject: SeriesPlaylist },
      { action: :bundle, subject: 'Episode' },
      { action: :read, subject: Announcement }
    ]
  }.freeze
  RECOMMEND_PLAYLIST_ABILITIES = {
    manager: { action: MANAGER_ACTIONS, subject: Playlist },        # 代表承認者
    approver: { action: APPROVER_ACTIONS, subject: Playlist },      # 承認者
    editor: { action: EDITOR_ACTIONS, subject: Playlist },          # 入力者
    reader: { action: READER_ACTION, subject: Playlist }            # 閲覧者
  }.freeze
  RECOMMEND_PLAYLIST_ITEM_ABILITIES = {
    manager: { action: MANAGER_ACTIONS, subject: PlaylistItem },    # 代表承認者
    approver: { action: APPROVER_ACTIONS, subject: PlaylistItem },  # 承認者
    editor: { action: EDITOR_ACTIONS, subject: PlaylistItem },      # 入力者
    reader: { action: READER_ACTION, subject: PlaylistItem }        # 閲覧者
  }.freeze

  def initialize(user)
    abilities = build(user)
    abilities.each do |ability|
      can ability[:action], ability[:subject], ability[:conditions]
    end
  end

  def build(user)
    abilities = []

    set_system_roles(user, abilities)

    set_recommend_playlist_roles(user, abilities)

    abilities
  end

  private

  def set_system_roles(user, abilities)
    SYSTEM_ROLES_ABILITIES.each_key do |role|
      user_has_role?(user, role, abilities)
    end
  end

  def user_has_role?(user, role, abilities)
    return unless user.has_role?(role)

    SYSTEM_ROLES_ABILITIES[role].each do |ability|
      abilities << ability
    end
  end

  def set_recommend_playlist_roles(user, abilities)
    RECOMMEND_PLAYLIST_ABILITIES.each_key do |role|
      abilities << RECOMMEND_PLAYLIST_ABILITIES[role] if Playlist.with_role(role, user).present?
    end

    set_recommend_playlist_items_roles(user, abilities)

    abilities
  end

  def set_recommend_playlist_items_roles(user, abilities)
    RECOMMEND_PLAYLIST_ITEM_ABILITIES.each_key do |role|
      abilities << RECOMMEND_PLAYLIST_ITEM_ABILITIES[role] if PlaylistItem.with_role(role, user).present?
    end

    abilities
  end
end
