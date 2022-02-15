import { Playlist } from 'types/playlist'
import { SameAs } from './same_as'

export interface Deck {
  id: string
  name: string
  description: string
  adminMemo?: string
  sameAs: Array<SameAs>
  playlists: Array<Playlist>
}
