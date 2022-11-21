import { FieldNamesMarkedBoolean } from 'react-hook-form'

import { Playlist } from '@/types/playlist'
import { EpisodeData } from '@/types/episode_data'
import { dirtyValues } from '@/lib/react-hook-form/utils'

import {
  CreatePlaylistParams,
  PlaylistFormInputs,
  SelectOption,
  UpdatePlaylistParams
} from '../types'

import {
  adjustLinkDarkColor,
  adjustLinkLightColor,
  adjustPrimaryDarkColor,
  adjustPrimaryLightColor,
  PALETTE_BASE_COLORS
} from './adjustColor'

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
  formatGenreCode: playlist?.formatGenre,
  themeGenreCode: playlist?.themeGenre,
  selectedPalette:
    playlist?.selectedPalette || PALETTE_BASE_COLORS[9],
  primaryLightColor: playlist?.primaryLight || adjustPrimaryLightColor(PALETTE_BASE_COLORS[9]),
  primaryDarkColor: playlist?.primaryDark || adjustPrimaryDarkColor(PALETTE_BASE_COLORS[9]),
  linkLightColor: playlist?.linkLight || adjustLinkLightColor(PALETTE_BASE_COLORS[9]),
  linkDarkColor: playlist?.linkDark || adjustLinkDarkColor(PALETTE_BASE_COLORS[9]),
  aliasId: playlist?.aliasId,
  sameAsAttributes: playlist?.sameAs,
  citationsAttributes: playlist?.citations,
  logoImageSrc: playlist?.logo?.medium?.url || '',
  eyecatchImageSrc: playlist?.eyecatch?.medium?.url || '',
  heroImageSrc: playlist?.hero?.medium?.url || '',
  apiState: playlist?.apiState === 'open',
  editorData: playlist?.editorData || { blocks: [] },
  markedHeader: playlist?.markedHeader,
  markedFooter: playlist?.markedFooter,
  authorType: playlist?.authorType || 'Organization',
  authorName: playlist?.authorName || 'NHK',
  publisherType: playlist?.publisherType || 'Organization',
  publisherName: playlist?.publisherName || 'NHK',
  episodes: playlist?.items || [],
  activeTvepisode: playlist?.activeTvepisode || true,
  activeArticle: playlist?.activeArticle,
  activeFaqpage: playlist?.activeFaqpage,
  activeHowto: playlist?.activeHowto,
  activeEvent: playlist?.activeEvent,
  activeRecipe: playlist?.activeRecipe,
  activeItemList: playlist?.activeItemList
})

const episodesToIds = (episodes?: EpisodeData[]) => {
  if (episodes) {
    return episodes.map((episode: EpisodeData) => episode.id)
  }
  return []
}

// NOTE: 見通しが悪くなるため
// eslint-disable-next-line max-statements
export const formValuesToCreateParams = (
  values: PlaylistFormInputs,
  dirtyFields: FieldNamesMarkedBoolean<PlaylistFormInputs>
) => {
  const onlyDirtyValues = dirtyValues(dirtyFields, values) as PlaylistFormInputs

  const {
    apiState,
    editorData,
    episodes,
    eyecatchImageSrc,
    hashtags,
    heroImageSrc,
    keywords,
    logoImageSrc,
    ...paramsValues
  } = onlyDirtyValues

  const data: CreatePlaylistParams = {
    ...paramsValues,
    apiState: apiState ? 'open' : 'close'
  }

  if (editorData) data.editorData = JSON.stringify(editorData)
  if (hashtags) data.hashtags = OptionsToArray(hashtags)
  if (keywords) data.keywords = OptionsToArray(keywords)
  if (episodes) data.items = episodesToIds(episodes)
  if (logoImageSrc) data.logoImage = logoImageSrc
  if (eyecatchImageSrc) data.eyecatchImage = eyecatchImageSrc
  if (heroImageSrc) data.heroImage = heroImageSrc
  if (apiState === undefined) data.apiState = values.apiState ? 'open' : 'close'

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

  return data
}
