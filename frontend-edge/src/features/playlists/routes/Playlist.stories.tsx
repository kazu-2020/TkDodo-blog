import { QueryClientProvider } from 'react-query'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'
import { Box } from '@chakra-ui/react'

import { handlers } from '@/test/server/handlers'
import { db, resetDb } from '@/test/server/db'
import { playlistGenerator } from '@/test/data-generators'
import { queryClient } from '@/lib/react-query'

import Playlist from './Playlist'

export default {
  component: Playlist
} as ComponentMeta<typeof Playlist>

const fakePlaylist = playlistGenerator()

export const Default: ComponentStoryObj<typeof Playlist> = {
  render: () => (
    <QueryClientProvider client={queryClient}>
      {/* ヘッダー分の高さを設定してStickyなArrowStepを調整 */}
      <Box h="60px" bgColor="#f0f0f0" zIndex="888" />
      <Playlist />
    </QueryClientProvider>
  ),
  parameters: {
    msw: {
      handlers
    },
    reactRouter: {
      routePath: '/series-decks/:playlistId',
      routeParams: { playlistId: fakePlaylist.id }
    }
  },
  play: async () => {
    // NOTE: NewPlaylistと被るのでsmoke testのみ
    await resetDb()

    const count = db.playlist.count({
      where: {
        id: {
          equals: fakePlaylist.id
        }
      }
    })
    if (count < 1) {
      // @ts-ignore
      await db.playlist.create(fakePlaylist)
    }
  }
}
