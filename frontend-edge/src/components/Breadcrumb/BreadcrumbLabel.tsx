import { useContext } from 'react'

import { BreadcrumbContext } from './BreadcrumbContext'

const EditTitle = (): string => {
  const context = useContext(BreadcrumbContext)
  const { name } = context.state
  return name.length > 26 ? `${name.substring(0, 26)}…` : name
}

const ConfigTitle = (): string => `[管理] ${EditTitle()}`

export const BreadcrumbLabel = [
  {
    path: '/',
    children: [
      { index: true, breadcrumb: 'ホーム' },
      { path: 'playlists', breadcrumb: 'プレイリスト一覧' },
      { path: 'playlists/new', breadcrumb: 'プレイリスト新規作成' },
      { path: 'playlists/:playlistUid', breadcrumb: EditTitle },
      { path: 'recommend-decks', breadcrumb: 'レコメンドデッキ一覧' },
      { path: 'recommend-decks/new', breadcrumb: 'レコメンドデッキ新規作成' },
      { path: 'recommend-decks/:recommendDeckId', breadcrumb: EditTitle },
      {
        path: 'recommend-decks/:recommendDeckId/config',
        breadcrumb: ConfigTitle
      },
      { path: 'series-decks', breadcrumb: 'シリーズデッキ一覧' },
      { path: 'series-decks/new', breadcrumb: 'シリーズデッキ新規作成' },
      { path: 'series-decks/:seriesDeckId', breadcrumb: EditTitle },
      { path: 'series-decks/:seriesDeckId/config', breadcrumb: ConfigTitle },
      { path: 'announcements', breadcrumb: 'お知らせ一覧' },
      { path: 'announcements/new', breadcrumb: '新規お知らせ登録' },
      {
        path: 'announcements/:announcementId',
        breadcrumb: null
      },
      {
        path: 'announcements/:announcementId/edit',
        breadcrumb: 'お知らせ編集'
      },
      { path: '*', breadcrumb: 'Page Not Found' }
    ]
  }
]
