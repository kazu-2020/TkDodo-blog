import create from 'zustand'

import { SeriesPlaylist } from '@/types/series_playlist'
import { SeriesDeckFormInputs } from '@/features/series-decks/types'

type SeriesDeckFormStore = {
  inputValues: SeriesDeckFormInputs
  setInputValues: (inputValues: SeriesDeckFormInputs) => void
  seriesPlaylists: SeriesPlaylist[]
  hasChangedSeriesPlaylists: boolean
  setSeriesPlaylists: (seriesPlaylists: SeriesPlaylist[]) => void
  addSeriesPlaylist: (seriesPlaylist: SeriesPlaylist) => void
  removeSeriesPlaylist: (id: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchQueryKey: 'word' | 'keyword' | 'concern'
  setSearchQueryKey: (query: 'word' | 'keyword' | 'concern') => void
  isSearched: boolean
  setSearched: (isSearched: boolean) => void
}

export const useSeriesDeckFormStore = create<SeriesDeckFormStore>((set) => ({
  inputValues: {
    name: '',
    interfix: '',
    description: '',
    apiState: false
  },
  setInputValues: (inputValues) => set({ inputValues }),
  seriesPlaylists: [],
  hasChangedSeriesPlaylists: false,
  setSeriesPlaylists: (seriesPlaylists) => set({ seriesPlaylists }),
  addSeriesPlaylist: (playlistSearchResult) =>
    set((state) => ({
      hasChangedSeriesPlaylists: true,
      seriesPlaylists: [...state.seriesPlaylists, { ...playlistSearchResult }]
    })),
  removeSeriesPlaylist: (seriesId) =>
    set((state) => ({
      hasChangedSeriesPlaylists: true,
      seriesPlaylists: state.seriesPlaylists.filter(
        (seriesPlaylist) => seriesPlaylist.seriesId !== seriesId
      )
    })),
  searchQuery: '',
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  searchQueryKey: 'word',
  setSearchQueryKey: (searchQueryKey: 'word' | 'keyword' | 'concern') =>
    set({ searchQueryKey }),
  isSearched: false,
  setSearched: (isSearched: boolean) => set({ isSearched })
}))
