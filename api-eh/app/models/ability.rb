# frozen_string_literal: true

class Ability
  include CanCan::Ability

  MANAGER_ACTIONS  = %i[read update destroy assign publish].freeze  # 代表承認者
  APPROVER_ACTIONS = %i[read update publish].freeze                 # 承認者
  EDITOR_ACTIONS   = %i[read update].freeze                         # 入力者
  READER_ACTION    = %i[read].freeze                                # 閲覧者

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

  def set_system_roles(user, abilities) # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
    # システムロール
    if user.has_role? :super_admin
      abilities << { action: :manage, subject: :all }
    elsif user.has_role? :user_admin # ユーザー管理者
      abilities << { action: :manage, subject: User }
      abilities << { action: :manage, subject: Announcement }
    elsif user.has_role? :playlist_admin # プレイリスト管理者
      abilities << { action: :manage, subject: Playlist }
      abilities << { action: :read, subject: PlaylistItem }
      abilities << { action: :manage, subject: 'Episode' } # NOTE: Episodeはmodelが存在しないためsubjectの定義方法が異なる
      abilities << { action: :manage, subject: Announcement }
    elsif user.has_role? :deck_admin # デッキ管理者
      abilities << { action: :manage, subject: Deck }
      abilities << { action: :manage, subject: SeriesDeck }
      abilities << { action: %i[episodes search], subject: SeriesPlaylist }
      abilities << { action: :manage, subject: Announcement }
    elsif user.has_role? :reader_user # 閲覧者
      abilities << { action: %i[read actors_and_contributors bundle_items], subject: Playlist }
      abilities << { action: :read, subject: PlaylistItem }
      abilities << { action: :read, subject: Deck }
      abilities << { action: :read, subject: SeriesDeck }
      abilities << { action: :episodes, subject: SeriesPlaylist }
      abilities << { action: :bundle, subject: 'Episode' }
      abilities << { action: :index, subject: Announcement }
    end

    abilities
  end

  def set_recommend_playlist_roles(user, abilities) # rubocop:disable Metrics/AbcSize
    # レコメンドプレイリストロール
    if Playlist.with_role(:manager, user).present? # 代表承認者
      abilities << { action: MANAGER_ACTIONS, subject: Playlist,
                     conditions: { string_id: Playlist.with_role(:manager, user).pluck(:string_id) } }
    elsif Playlist.with_role(:approver, user).present? # 承認者
      abilities << { action: APPROVER_ACTIONS, subject: Playlist,
                     conditions: { string_id: Playlist.with_role(:approver, user).pluck(:string_id) } }
    elsif Playlist.with_role(:editor, user).present? # 入力者
      abilities << { action: EDITOR_ACTIONS, subject: Playlist,
                     conditions: { string_id: Playlist.with_role(:editor, user).pluck(:string_id) } }
    elsif Playlist.with_role(:reader, user).present? # 閲覧者
      abilities << { action: READER_ACTION, subject: Playlist,
                     conditions: { string_id: Playlist.with_role(:reader, user).pluck(:string_id) } }
    end

    set_recommend_playlist_items_roles(user, abilities)

    abilities
  end

  def set_recommend_playlist_items_roles(user, abilities) # rubocop:disable Metrics/AbcSize
    if PlaylistItem.with_role(:manager, user).present? # 代表承認者
      abilities << { action: MANAGER_ACTIONS, subject: PlaylistItem,
                     conditions: { playlist_id: PlaylistItem.with_role(:manager, user).pluck(:playlist_id) } }
    elsif PlaylistItem.with_role(:approver, user).present? # 承認者
      abilities << { action: APPROVER_ACTIONS, subject: PlaylistItem,
                     conditions: { playlist_id: PlaylistItem.with_role(:approver, user).pluck(:playlist_id) } }
    elsif PlaylistItem.with_role(:editor, user).present? # 入力者
      abilities << { action: EDITOR_ACTIONS, subject: PlaylistItem,
                     conditions: { playlist_id: PlaylistItem.with_role(:editor, user).pluck(:playlist_id) } }
    elsif PlaylistItem.with_role(:reader, user).present? # 閲覧者
      abilities << { action: READER_ACTION, subject: PlaylistItem,
                     conditions: { playlist_id: PlaylistItem.with_role(:reader, user).pluck(:playlist_id) } }
    end

    abilities
  end
end
