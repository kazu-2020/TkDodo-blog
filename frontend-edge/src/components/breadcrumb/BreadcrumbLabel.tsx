import {useContext} from "react"

import {BreadcrumbContext} from "@/components/breadcrumb/BreadcrumbContext"

const EditTitle = (): string => {
  const context = useContext(BreadcrumbContext)
  return context.state.name
}

const ConfigTitle = (): string => {
  const context = useContext(BreadcrumbContext)
  return `[管理] ${context.state.name}`
}

export const BreadcrumbLabel = [
  {
    path: '/',
    children: [
      { index: true, breadcrumb: 'ホーム', },
      { path: 'playlists', breadcrumb: 'プレイリスト一覧', },
      { path: 'playlists/new', breadcrumb: 'プレイリスト新規作成', },
      { path: 'playlists/:playlistUId', breadcrumb: EditTitle, },
      { path: 'recommend-decks', breadcrumb: 'レコメンドデッキ一覧',  },
      { path: 'recommend-decks/new', breadcrumb: 'レコメンドデッキ新規作成', },
      { path: 'recommend-decks/:recommendDeckId', breadcrumb: EditTitle, },
      { path: 'recommend-decks/:recommendDeckId/config', breadcrumb: ConfigTitle, },
      { path: 'series-decks', breadcrumb: 'シリーズデッキ一覧',  },
      { path: 'series-decks/new', breadcrumb: 'シリーズデッキ新規作成', },
      { path: 'series-decks/:seriesDeckId', breadcrumb: EditTitle, },
      { path: 'series-decks/:seriesDeckId/config', breadcrumb: ConfigTitle, },
      { path: '*', breadcrumb: 'Page Not Found', },
    ]
  }
]