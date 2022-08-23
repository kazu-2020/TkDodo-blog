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
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchQueryKey: 'word' | 'keyword' | 'concern'
  setSearchQueryKey: (query: 'word' | 'keyword' | 'concern') => void
  isSearched: boolean
  setSearched: (isSearched: boolean) => void
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
          (recommendPlaylist) => recommendPlaylist.seriesId !== recommendId
        )
      })),
    searchQuery: '',
    setSearchQuery: (searchQuery: string) => set({ searchQuery }),
    searchQueryKey: 'word',
    setSearchQueryKey: (searchQueryKey: 'word' | 'keyword' | 'concern') =>
      set({ searchQueryKey }),
    isSearched: false,
    setSearched: (isSearched: boolean) => set({ isSearched })
  })
)
