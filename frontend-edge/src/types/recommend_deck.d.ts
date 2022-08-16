import { Playlist } from './playlist'

export type RecommendDeck = {
  id: string
  name: string
  description?: string
  interfix: string
  stringId: string
  adminMemo?: string
  apiState: 'open' | 'close' | 'waiting'
  playListCount: number
  playlists: Playlist[]
  dateCreated: string
  dateModified: string
}
