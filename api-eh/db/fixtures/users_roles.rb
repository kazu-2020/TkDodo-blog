# frozen_string_literal: true
user_admin_id = Role.find_by(name: 'user_admin').id
playlist_admin_id = Role.find_by(name: 'playlist_admin').id
deck_admin_id = Role.find_by(name: 'deck_admin').id
reader_user_id = Role.find_by(name: 'reader_user').id

# Admin: ユーザー管理者
UsersRole.create_or_find_by(user_id: 1, role_id: user_admin_id)
# User: プレイリスト管理者 兼 デッキ管理者
UsersRole.create_or_find_by(user_id: 2, role_id: playlist_admin_id)
UsersRole.create_or_find_by(user_id: 2, role_id: deck_admin_id)
# 職位なし： ユーザー管理者 兼　プレイリスト管理者　兼　デッキ管理者
UsersRole.create_or_find_by(user_id: 3, role_id: user_admin_id)
UsersRole.create_or_find_by(user_id: 3, role_id: playlist_admin_id)
UsersRole.create_or_find_by(user_id: 3, role_id: deck_admin_id)
# User: 閲覧者
UsersRole.create_or_find_by(user_id: 4, role_id: reader_user_id)
