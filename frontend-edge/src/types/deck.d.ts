import { Playlist } from 'src/types/playlist'

import { SameAs } from './same_as'

export type Deck = {
  id: string
  name: string
  description?: string
  interfix: string
  stringId: string
  adminMemo?: string
  apiState: 'open' | 'close' | 'waiting'
  sameAs: SameAs[]
  playlists: Playlist[]
}
