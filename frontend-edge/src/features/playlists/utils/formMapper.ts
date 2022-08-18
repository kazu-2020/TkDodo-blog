import { Playlist } from '@/types/playlist'

import { PlaylistFormInputs } from '../types'

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
  primaryLight: playlist?.primaryLight || '#ffffff',
  primaryDark: playlist?.primaryDark || '#ffffff',
  linkLight: playlist?.linkLight || '#ffffff',
  linkDark: playlist?.linkDark || '#ffffff',
  aliasId: playlist?.aliasId || '',
  // sameAs: playlist?.sameAs || [],
  // citations: playlist?.citations || [],
  // selectedTypes: playlist?.selectedTypes || [],
  tvepisodeCount: playlist?.tvepisodeCount || 0,
  faqpageCount: playlist?.faqpageCount || 0,
  howtoCount: playlist?.howtoCount || 0,
  eventCount: playlist?.eventCount || 0,
  logoImageData: '',
  eyeCatchImageData: '',
  heroImageData: '',
  apiState: playlist?.apiState === 'open',
  editorData: playlist?.article.body || { blocks: [] },
  markedHeader: playlist?.article.header || '',
  markedFooter: playlist?.article.footer || '',
  authorType: playlist?.article.authorType || 'Organization',
  authorName: playlist?.article.authorName || 'NHK',
  publisherType: playlist?.article.publisherType || 'Organization',
  publisherName: playlist?.article.publisherName || 'NHK'
})
