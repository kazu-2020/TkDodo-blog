import { Playlist } from 'types/playlist'
import { SameAs } from './same_as'

export interface Deck {
  id: string
  name: string
  description: string
  deckLabelId?: number
  adminMemo?: string
  sameAs: Array<SameAs>
  playlists: Array<Playlist>
}
