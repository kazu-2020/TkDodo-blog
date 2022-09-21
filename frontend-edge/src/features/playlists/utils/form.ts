import { FieldNamesMarkedBoolean } from 'react-hook-form'

import { Playlist } from '@/types/playlist'
import { EpisodeData } from '@/types/episode_data'

import {
  CreatePlaylistParams,
  PlaylistFormInputs,
  SelectOption,
  UpdatePlaylistParams
} from '../types'

import { PALETTE_BASE_COLORS } from './adjustColor'

const arrayToOptions = (array: string[]): SelectOption[] =>
  array.map((item) => ({
    label: item,
    value: item
  }))

const OptionsToArray = (options: SelectOption[]): string[] =>
  options.map((item) => item.value)

export const playlistToDefaultValues = (
  playlist: Playlist | undefined
): PlaylistFormInputs => ({
  name: playlist?.name || '',
  detailedNameRuby: playlist?.detailedNameRuby,
  detailedCatch: playlist?.detailedCatch,
  description: playlist?.description,
  keywords: playlist?.keywords ? arrayToOptions(playlist.keywords) : [],
  hashtags: playlist?.hashtag ? arrayToOptions(playlist.hashtag) : [],
  formatGenre: playlist?.formatGenre,
  themeGenre: playlist?.themeGenre,
  selectedPalette:
    playlist?.selectedPalette ||
    PALETTE_BASE_COLORS[Math.floor(Math.random() * PALETTE_BASE_COLORS.length)],
  primaryLightColor: playlist?.primaryLight || '#929292',
  primaryDarkColor: playlist?.primaryDark || '#ffffff',
  linkLightColor: playlist?.linkLight || '#747474',
  linkDarkColor: playlist?.linkDark || '#ffffff',
  aliasId: playlist?.aliasId,
  sameAsAttributes: playlist?.sameAs,
  citationsAttributes: playlist?.citations,
  logoImageSrc: playlist?.logo?.medium?.url || '',
  eyecatchImageSrc: playlist?.eyecatch?.medium?.url || '',
  heroImageSrc: playlist?.hero?.medium?.url || '',
  apiState: playlist?.apiState === 'open',
  editorData: playlist?.article.body || { blocks: [] },
  markedHeader: playlist?.article.header,
  markedFooter: playlist?.article.footer,
  authorType: playlist?.article.authorType || 'Organization',
  authorName: playlist?.article.authorName || 'NHK',
  publisherType: playlist?.article.publisherType || 'Organization',
  publisherName: playlist?.article.publisherName || 'NHK',
  episodes: playlist?.items || [],
  activeTvepisode: playlist?.activeTvepisode,
  activeArticle: playlist?.activeArticle,
  activeFaqpage: playlist?.activeFaqpage,
  activeHowto: playlist?.activeHowto,
  activeEvent: playlist?.activeEvent,
  activeRecipe: playlist?.activeRecipe,
  activeItemList: playlist?.activeItemList
})

const episodesToIds = (episodes?: EpisodeData[]) => {
  if (episodes) {
    return episodes.map((episode: EpisodeData) => ({ episodeId: episode.id }))
  }
  return []
}

export const formValuesToCreateParams = (
  values: PlaylistFormInputs,
  dirtyFields: FieldNamesMarkedBoolean<PlaylistFormInputs>
) => {
  const {
    logoImageSrc,
    eyecatchImageSrc,
    heroImageSrc,
    keywords,
    hashtags,
    apiState,
    ...paramsValues
  } = values

  const data: CreatePlaylistParams = {
    ...paramsValues,
    playlistItemsAttributes: episodesToIds(paramsValues.episodes),
    keywords: OptionsToArray(keywords),
    hashtags: OptionsToArray(hashtags)
  }

  data.apiState = apiState ? 'open' : 'close'

  if (dirtyFields.logoImageSrc) {
    data.logoImage = logoImageSrc
  }
  if (dirtyFields.eyecatchImageSrc) {
    data.eyecatchImage = eyecatchImageSrc
  }
  if (dirtyFields.heroImageSrc) {
    data.heroImage = heroImageSrc
  }
  return data
}

export const formValuesToUpdateParams = (
  values: PlaylistFormInputs,
  dirtyFields: FieldNamesMarkedBoolean<PlaylistFormInputs>
) => {
  const data: UpdatePlaylistParams = formValuesToCreateParams(
    values,
    dirtyFields
  )
  data.enableListUpdate = true // FIXME: 1 or 0
  return data
}
