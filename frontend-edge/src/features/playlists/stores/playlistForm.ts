import { devtools } from 'zustand/middleware'
import create from 'zustand'

type PlaylistFormStore = {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchQueryKey: 'word' | 'keyword' | 'concern'
  setSearchQueryKey: (query: 'word' | 'keyword' | 'concern') => void
  isSearched: boolean
  setSearched: (isSearched: boolean) => void
  clearStore: () => void
}

export const usePlaylistFormStore = create<PlaylistFormStore>()((set) => ({
  searchQuery: '',
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  searchQueryKey: 'word',
  setSearchQueryKey: (searchQueryKey: 'word' | 'keyword' | 'concern') =>
    set({ searchQueryKey }),
  isSearched: false,
  setSearched: (isSearched: boolean) => set({ isSearched }),
  clearStore: () => set({}, true)
}))
