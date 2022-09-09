import { FieldNamesMarkedBoolean } from 'react-hook-form'

import { Playlist } from '@/types/playlist'

import {
  CreatePlaylistParams,
  PlaylistFormInputs,
  UpdatePlaylistParams
} from '../types'

import { PALETTE_BASE_COLORS } from './adjustColor'

export const playlistToDefaultValues = (
  playlist: Playlist | undefined
): PlaylistFormInputs => ({
  name: playlist?.name || '',
  detailedNameRuby: playlist?.detailedNameRuby || '',
  detailedCatch: playlist?.detailedCatch || '',
  description: playlist?.description || '',
  keywords: playlist?.keywords || '',
  hashtags: playlist?.hashtag || '',
  formatGenre: playlist?.formatGenre || '',
  themeGenre: playlist?.themeGenre || '',
  selectedPalette:
    playlist?.selectedPalette ||
    PALETTE_BASE_COLORS[Math.floor(Math.random() * PALETTE_BASE_COLORS.length)],
  primaryLightColor: playlist?.primaryLight || '#929292',
  primaryDarkColor: playlist?.primaryDark || '#ffffff',
  linkLightColor: playlist?.linkLight || '#747474',
  linkDarkColor: playlist?.linkDark || '#ffffff',
  aliasId: playlist?.aliasId || '',
  // sameAs: playlist?.sameAs || [],
  // citations: playlist?.citations || [],
  // selectedTypes: playlist?.selectedTypes || [],
  tvepisodeCount: playlist?.tvepisodeCount || 0,
  faqpageCount: playlist?.faqpageCount || 0,
  howtoCount: playlist?.howtoCount || 0,
  eventCount: playlist?.eventCount || 0,
  logoImageSrc: playlist?.logo?.medium?.url || '',
  eyecatchImageSrc: playlist?.eyecatch?.medium?.url || '',
  heroImageSrc: playlist?.hero?.medium?.url || '',
  apiState: playlist?.apiState === 'open',
  editorData: playlist?.article.body || { blocks: [] },
  markedHeader: playlist?.article.header || '',
  markedFooter: playlist?.article.footer || '',
  authorType: playlist?.article.authorType || 'Organization',
  authorName: playlist?.article.authorName || 'NHK',
  publisherType: playlist?.article.publisherType || 'Organization',
  publisherName: playlist?.article.publisherName || 'NHK',
  episodes: playlist?.items || []
})

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
    keywords: [], // TODO
    hashtags: [] // TODO
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
  data.enableListUpdate = true
  return data
}
