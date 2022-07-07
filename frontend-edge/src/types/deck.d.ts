import { Playlist } from 'src/types/playlist'

import { SameAs } from './same_as'

export interface Deck {
  id?: string
  name: string
  description?: string
  interfix: string
  stringId: string
  adminMemo?: string
  apiState: string
  sameAs: Array<SameAs>
  playlists: Array<Playlist>
}
