import { Playlist } from 'types/playlist'

export interface Deck {
  id: string
  name: string
  playlists: Array<Playlist>
}
