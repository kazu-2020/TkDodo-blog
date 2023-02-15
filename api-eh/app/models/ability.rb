# frozen_string_literal: true

class Ability
  include CanCan::Ability
  # 代表承認者
  MANAGER_ACTIONS = %i[
    read
    update
    destroy
    assign
    publish
    bulk_update
    upload_article_image_by_url
    upload_article_image_by_file
    actors_and_contributors
    bundle_items
  ].freeze
  # 承認者
  APPROVER_ACTIONS = %i[
    read update publish
    bulk_update upload_article_image_by_url
    upload_article_image_by_file
    actors_and_contributors
    bundle_items
  ].freeze
  # 入力者
  EDITOR_ACTIONS = %i[
    read
    update
    bulk_update
    upload_article_image_by_url
    upload_article_image_by_file
    actors_and_contributors
    bundle_items
  ].freeze
  # 閲覧者
  READER_ACTIONS = %i[
    read
    actors_and_contributors
    bundle_items
  ].freeze

  SYSTEM_ROLES = {
    # ユーザー管理者
    user_admin: [
      { action: :manage, subject: User },
      { action: :manage, subject: Announcement }
    ],
    # プレイリスト管理者
    playlist_admin: [
      { action: :manage, subject: Playlist },
      { action: :manage, subject: PlaylistItem },
      { action: :manage, subject: Episode },
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
      { action: :bundle, subject: Episode }
    ]
  }.freeze
  RECOMMEND_PLAYLIST_ROLES = {
    manager: [ # 代表承認者
      { action: MANAGER_ACTIONS, subject: Playlist },
      { action: MANAGER_ACTIONS, subject: PlaylistItem }
    ],
    approver: [ # 承認者
      { action: APPROVER_ACTIONS, subject: Playlist },
      { action: APPROVER_ACTIONS, subject: PlaylistItem }
    ],
    editor: [ # 入力者
      { action: EDITOR_ACTIONS, subject: Playlist },
      { action: EDITOR_ACTIONS, subject: PlaylistItem }
    ],
    reader: [ # 閲覧者
      { action: READER_ACTIONS, subject: Playlist },
      { action: READER_ACTIONS, subject: PlaylistItem }
    ]
  }.freeze

  def initialize(user)
    abilities = build(user)
    abilities.each do |ability|
      can ability[:action], ability[:subject], ability[:conditions]
    end
  end

  def build(user)
    abilities = []

    abilities.concat(SYSTEM_ROLES.flat_map { |role, ability| user.has_role?(role) ? ability : [] })

    abilities.concat(RECOMMEND_PLAYLIST_ROLES.flat_map do |role, ability|
                       has_recommend_playlist_role?(role, user) ? ability : []
                     end)
    abilities
  end

  private

  def has_recommend_playlist_role?(role, user)
    Playlist.with_role(role, user).present?
  end
end
