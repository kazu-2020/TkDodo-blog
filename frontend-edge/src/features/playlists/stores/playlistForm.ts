import create from 'zustand'

import { EpisodeData } from '@/types/episode_data'
import { PlaylistFormInputs } from '@/features/playlists/types'

type PlaylistFormStore = {
  inputValues: PlaylistFormInputs
  setInputValues: (inputValues: PlaylistFormInputs) => void
  episodes: EpisodeData[]
  hasChangedEpisodes: boolean
  resetHasChangedEpisodes: () => void
  setEpisodes: (episodes: EpisodeData[]) => void
  addEpisode: (episode: EpisodeData) => void
  removeEpisode: (id: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchQueryKey: 'word' | 'keyword' | 'concern'
  setSearchQueryKey: (query: 'word' | 'keyword' | 'concern') => void
  isSearched: boolean
  setSearched: (isSearched: boolean) => void
}

export const usePlaylistFormStore = create<PlaylistFormStore>((set) => ({
  inputValues: {
    name: '',
    interfix: '',
    description: '',
    apiState: false
  },
  setInputValues: (inputValues) => set({ inputValues }),
  episodes: [],
  hasChangedEpisodes: false,
  resetHasChangedEpisodes: () => set({ hasChangedEpisodes: false }),
  setEpisodes: (episodes) => set({ episodes }),
  addEpisode: (episodeSearchResult) =>
    set((state) => ({
      hasChangedEpisodes: true,
      episodes: [...state.episodes, { ...episodeSearchResult }]
    })),
  removeEpisode: (episodeId) =>
    set((state) => ({
      hasChangedEpisodes: true,
      episodes: state.episodes.filter(
        (episode) => episode.episodeId !== episodeId
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
