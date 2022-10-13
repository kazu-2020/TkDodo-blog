import { SameAs } from '@/types/same_as'
import { RecommendPlaylist } from '@/types/recommend_playlist'

export type RecommendDeck = {
  id: string
  name: string
  description?: string
  interfix: string
  sameAs: SameAs[]
  stringId: string
  adminMemo?: string
  playListCount: number
  playlists: RecommendPlaylist[]
  dateCreated: string
  dateModified: string
} & ApiState
