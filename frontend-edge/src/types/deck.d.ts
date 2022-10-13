import { Playlist } from 'src/types/playlist'
import { ApiState } from '@/types/api_state'

import { SameAs } from './same_as'

export type Deck = {
  id: string
  name: string
  description?: string
  interfix: string
  stringId: string
  adminMemo?: string
  sameAs: SameAs[]
  playlists: Playlist[]
} & ApiState
