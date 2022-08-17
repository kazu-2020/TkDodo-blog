import { QueryClientProvider } from 'react-query'
import { ComponentMeta } from '@storybook/react'

import { handlers } from '@/test/server/handlers'
import { db, resetDb } from '@/test/server/db'
import { playlistGenerator } from '@/test/data-generators'
import { queryClient } from '@/lib/react-query'

import Playlists from './Playlists'

export default {
  component: Playlists
} as ComponentMeta<typeof Playlists>

resetDb()
const playlists = db.playlist.getAll()
if (playlists.length < 1) {
  ;[...Array(20)].map(async () => db.playlist.create(playlistGenerator()))
}

export const Default = {
  render: () => (
    <QueryClientProvider client={queryClient}>
      <Playlists />
    </QueryClientProvider>
  ),
  parameters: {
    msw: {
      handlers
    }
  }
}

// TODO: テストを書く
// export const DeletePlaylist = {
//   ...Default,
//   name: 'デッキの削除'
// }
