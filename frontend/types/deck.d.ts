import { Playlist } from 'types/playlist'
import { SameAs } from './same_as'

export interface Deck {
  id?: string
  name: string
  description?: string
  interfix: string
  adminMemo?: string
  apiState?: string
  sameAs: Array<SameAs>
  playlists: Array<Playlist>
}
