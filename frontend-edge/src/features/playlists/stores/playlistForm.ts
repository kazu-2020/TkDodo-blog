import { devtools } from 'zustand/middleware'
import create from 'zustand'
import { OutputData } from '@editorjs/editorjs'

import { EpisodeData } from '@/types/episode_data'
import { Article } from '@/types/article'
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
  article: Article | undefined
  setArticle: (article: Article) => void
  hasChangedArticle: boolean
  resetHasChangedArticle: () => void
  clearStore: () => void
}

export const usePlaylistFormStore = create<PlaylistFormStore>()(
  devtools((set) => ({
    inputValues: {
      // TODO: 実装する
      name: '',
      description: '',
      apiState: false,
      editorData: {} as OutputData,
      markedHeader: '',
      markedFooter: '',
      authorType: '',
      authorName: '',
      publisherName: '',
      publisherType: ''
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
        episodes: state.episodes.filter((episode) => episode.id !== episodeId)
      })),
    searchQuery: '',
    setSearchQuery: (searchQuery: string) => set({ searchQuery }),
    searchQueryKey: 'word',
    setSearchQueryKey: (searchQueryKey: 'word' | 'keyword' | 'concern') =>
      set({ searchQueryKey }),
    isSearched: false,
    setSearched: (isSearched: boolean) => set({ isSearched }),
    article: undefined,
    setArticle: (article: Article) => set({ article }),
    hasChangedArticle: false,
    resetHasChangedArticle: () => set({ hasChangedArticle: false }),
    clearStore: () => set({}, true)
  }))
)
