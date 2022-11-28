import create from 'zustand'

import { RecommendPlaylist } from '@/types/recommend_playlist'
import { RecommendDeckFormInputs } from '@/features/recommend-decks/types'

type RecommendDeckFormStore = {
  inputValues: RecommendDeckFormInputs
  setInputValues: (inputValues: RecommendDeckFormInputs) => void
  recommendPlaylists: RecommendPlaylist[]
  hasChangedRecommendPlaylists: boolean
  resetHasChangedRecommendPlaylists: () => void
  setRecommendPlaylists: (recommendPlaylists: RecommendPlaylist[]) => void
  addRecommendPlaylist: (recommendPlaylist: RecommendPlaylist) => void
  removeRecommendPlaylist: (id: string) => void
}

export const useRecommendDeckFormStore = create<RecommendDeckFormStore>(
  (set) => ({
    inputValues: {
      name: '',
      interfix: '',
      description: '',
      apiState: false
    },
    setInputValues: (inputValues) => set({ inputValues }),
    recommendPlaylists: [],
    hasChangedRecommendPlaylists: false,
    resetHasChangedRecommendPlaylists: () =>
      set({ hasChangedRecommendPlaylists: false }),
    setRecommendPlaylists: (recommendPlaylists) => set({ recommendPlaylists }),
    addRecommendPlaylist: (playlistSearchResult) =>
      set((state) => ({
        hasChangedRecommendPlaylists: true,
        recommendPlaylists: [
          ...state.recommendPlaylists,
          { ...playlistSearchResult }
        ]
      })),
    removeRecommendPlaylist: (recommendId) =>
      set((state) => ({
        hasChangedRecommendPlaylists: true,
        recommendPlaylists: state.recommendPlaylists.filter(
          (recommendPlaylist) => recommendPlaylist.playlistUid !== recommendId
        )
      }))
  })
)
