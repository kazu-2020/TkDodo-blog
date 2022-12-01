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

const optionsToArray = (options: SelectOption[]): string[] =>
  options.map((item) => item.value)

export const playlistToDefaultValues = (
  playlist: Playlist | undefined
): PlaylistFormInputs => ({
  name: playlist?.name || '',
  detailedNameRuby: playlist?.detailedNameRuby,
  detailedCatch: playlist?.detailedCatch,
  description: playlist?.description,
  keywords: playlist?.keywords ? arrayToOptions(playlist.keywords) : [],
  hashtags: playlist?.hashtags ? arrayToOptions(playlist.hashtags) : [],
  formatGenreCode: playlist?.formatGenreCode,
  themeGenreCode: playlist?.themeGenreCode,
  selectedPalette: playlist?.selectedPalette || PALETTE_BASE_COLORS[9],
  primaryLightColor:
    playlist?.primaryLightColor ||
    adjustPrimaryLightColor(PALETTE_BASE_COLORS[9]),
  primaryDarkColor:
    playlist?.primaryDarkColor ||
    adjustPrimaryDarkColor(PALETTE_BASE_COLORS[9]),
  linkLightColor:
    playlist?.linkLightColor || adjustLinkLightColor(PALETTE_BASE_COLORS[9]),
  linkDarkColor:
    playlist?.linkDarkColor || adjustLinkDarkColor(PALETTE_BASE_COLORS[9]),
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
  if (hashtags) data.hashtags = optionsToArray(hashtags)
  if (keywords) data.keywords = optionsToArray(keywords)
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

if (import.meta.vitest) {
  const { playlistGenerator, episodeDataGenerator } = await import(
    '@/test/data-generators'
  )

  const { describe, it, expect } = import.meta.vitest
  describe('arrayToOptions', () => {
    it('空配列の場合', () => {
      const options = arrayToOptions([])
      expect(options).toHaveLength(0)
    })

    it('配列の場合', () => {
      const options = arrayToOptions(['dummy1', 'dummy2'])
      expect(options).toHaveLength(2)

      expect(options[0].label).toEqual('dummy1')
      expect(options[0].value).toEqual('dummy1')
      expect(options[1].label).toEqual('dummy2')
      expect(options[1].value).toEqual('dummy2')
    })
  })

  describe('optionsToArray', () => {
    it('空配列の場合', () => {
      const array = optionsToArray([])
      expect(array).toHaveLength(0)
    })

    it('配列の場合', () => {
      const array = optionsToArray([
        { label: 'dummy1-l', value: 'dummy1-v' },
        { label: 'dummy2-l', value: 'dummy2-v' }
      ])
      expect(array).toHaveLength(2)

      expect(array[0]).toEqual('dummy1-v')
      expect(array[1]).toEqual('dummy2-v')
    })
  })

  // eslint-disable-next-line max-lines-per-function,max-statements
  describe('playlistToDefaultValues', () => {
    // eslint-disable-next-line max-statements
    it('未定義の場合', () => {
      const values = playlistToDefaultValues(undefined)

      expect(values.name).toEqual('')
      expect(values.detailedNameRuby).toEqual(undefined)
      expect(values.detailedCatch).toEqual(undefined)
      expect(values.description).toEqual(undefined)
      expect(values.keywords).toEqual([])
      expect(values.hashtags).toEqual([])
      expect(values.formatGenreCode).toEqual(undefined)
      expect(values.themeGenreCode).toEqual(undefined)
      expect(values.selectedPalette).toEqual('#84919e')
      expect(values.primaryLightColor).toEqual('#84919e')
      expect(values.primaryDarkColor).toEqual('#84919e')
      expect(values.linkLightColor).toEqual('#6a757f')
      expect(values.linkDarkColor).toEqual('#84919e')
      expect(values.aliasId).toEqual(undefined)
      expect(values.sameAsAttributes).toEqual(undefined)
      expect(values.citationsAttributes).toEqual(undefined)
      expect(values.logoImageSrc).toEqual('')
      expect(values.eyecatchImageSrc).toEqual('')
      expect(values.heroImageSrc).toEqual('')
      expect(values.apiState).toEqual(false)
      expect(values.editorData).toEqual({ blocks: [] })
      expect(values.markedHeader).toEqual(undefined)
      expect(values.markedFooter).toEqual(undefined)
      expect(values.authorType).toEqual('Organization')
      expect(values.authorName).toEqual('NHK')
      expect(values.publisherType).toEqual('Organization')
      expect(values.publisherName).toEqual('NHK')
      expect(values.episodes).toEqual([])
      expect(values.activeTvepisode).toEqual(true)
      expect(values.activeArticle).toEqual(undefined)
      expect(values.activeFaqpage).toEqual(undefined)
      expect(values.activeHowto).toEqual(undefined)
      expect(values.activeEvent).toEqual(undefined)
      expect(values.activeRecipe).toEqual(undefined)
      expect(values.activeItemList).toEqual(undefined)
    })

    // eslint-disable-next-line max-statements
    it('定義されている場合', () => {
      const playlist = playlistGenerator({ editorData: { blocks: ['xxxx'] } })
      const values = playlistToDefaultValues(playlist)

      expect(values.name).toEqual(playlist.name)
      expect(values.detailedNameRuby).toEqual(playlist.detailedNameRuby)
      expect(values.detailedCatch).toEqual(playlist.detailedCatch)
      expect(values.description).toEqual(playlist.description)
      expect(values.keywords).toEqual(arrayToOptions(playlist.keywords))
      expect(values.hashtags).toEqual(arrayToOptions(playlist.hashtags))
      expect(values.formatGenreCode).toEqual(playlist.formatGenreCode)
      expect(values.themeGenreCode).toEqual(playlist.themeGenreCode)
      expect(values.selectedPalette).toEqual(playlist.selectedPalette)
      expect(values.primaryLightColor).toEqual(playlist.primaryLightColor)
      expect(values.primaryDarkColor).toEqual(playlist.primaryDarkColor)
      expect(values.linkLightColor).toEqual(playlist.linkLightColor)
      expect(values.linkDarkColor).toEqual(playlist.linkDarkColor)
      expect(values.aliasId).toEqual(playlist.aliasId)
      expect(values.editorData).toEqual(playlist.editorData)
      expect(values.markedHeader).toEqual(playlist.markedHeader)
      expect(values.markedFooter).toEqual(playlist.markedFooter)
      expect(values.authorType).toEqual(playlist.authorType)
      expect(values.authorName).toEqual(playlist.authorName)
      expect(values.publisherType).toEqual(playlist.publisherType)
      expect(values.publisherName).toEqual(playlist.publisherName)
    })

    it('sameAsAttributesの確認', () => {
      const playlist = playlistGenerator()
      const values = playlistToDefaultValues(playlist)
      expect(values.sameAsAttributes).toEqual(playlist.sameAs)
    })
    it('citationsAttributesの確認', () => {
      const playlist = playlistGenerator()
      const values = playlistToDefaultValues(playlist)
      expect(values.citationsAttributes).toEqual(playlist.citations)
    })
    it('logoImageSrcの確認', () => {
      const playlist = playlistGenerator({
        logo: { medium: { url: 'dummy.jpg', width: 1, height: 1 } }
      })
      const values = playlistToDefaultValues(playlist)
      expect(values.logoImageSrc).toEqual(playlist.logo?.medium?.url)
    })
    it('eyecatchImageSrcの確認', () => {
      const playlist = playlistGenerator({
        eyecatch: { medium: { url: 'dummy.jpg', width: 1, height: 1 } }
      })
      const values = playlistToDefaultValues(playlist)
      expect(values.eyecatchImageSrc).toEqual(playlist.eyecatch?.medium?.url)
    })
    it('heroImageSrcの確認', () => {
      const playlist = playlistGenerator({
        hero: { medium: { url: 'dummy.jpg', width: 1, height: 1 } }
      })
      const values = playlistToDefaultValues(playlist)
      expect(values.heroImageSrc).toEqual(playlist.hero?.medium?.url)
    })
    it('apiStateの確認', () => {
      const playlist1 = playlistGenerator({ apiState: 'open' })
      const values1 = playlistToDefaultValues(playlist1)
      expect(values1.apiState).toBeTruthy()

      const playlist2 = playlistGenerator({ apiState: 'close' })
      const values2 = playlistToDefaultValues(playlist2)
      expect(values2.apiState).toBeFalsy()
    })
    it('episodesの確認', () => {
      const playlist = playlistGenerator({
        items: [episodeDataGenerator(), episodeDataGenerator()]
      })
      const values = playlistToDefaultValues(playlist)
      expect(values.episodes).toEqual(playlist.items)
    })

    it('activeTvepisodeの確認', () => {
      const playlist1 = playlistGenerator({ activeTvepisode: true })
      const values1 = playlistToDefaultValues(playlist1)
      expect(values1.activeTvepisode).toBeTruthy()

      const playlist2 = playlistGenerator({ activeTvepisode: false })
      const values2 = playlistToDefaultValues(playlist2)
      expect(values2.activeTvepisode).toBeTruthy() // TODO: 常にTrueを返却するのが仕様として正しいのか要確認
    })
    it('activeArticleの確認', () => {
      const playlist1 = playlistGenerator({ activeArticle: true })
      const values1 = playlistToDefaultValues(playlist1)
      expect(values1.activeArticle).toBeTruthy()

      const playlist2 = playlistGenerator({ activeArticle: false })
      const values2 = playlistToDefaultValues(playlist2)
      expect(values2.activeArticle).toBeFalsy()
    })
    it('activeFaqpageの確認', () => {
      const playlist1 = playlistGenerator({ activeFaqpage: true })
      const values1 = playlistToDefaultValues(playlist1)
      expect(values1.activeFaqpage).toBeTruthy()

      const playlist2 = playlistGenerator({ activeFaqpage: false })
      const values2 = playlistToDefaultValues(playlist2)
      expect(values2.activeFaqpage).toBeFalsy()
    })
    it('activeHowtoの確認', () => {
      const playlist1 = playlistGenerator({ activeHowto: true })
      const values1 = playlistToDefaultValues(playlist1)
      expect(values1.activeHowto).toBeTruthy()

      const playlist2 = playlistGenerator({ activeHowto: false })
      const values2 = playlistToDefaultValues(playlist2)
      expect(values2.activeHowto).toBeFalsy()
    })
    it('activeEventの確認', () => {
      const playlist1 = playlistGenerator({ activeEvent: true })
      const values1 = playlistToDefaultValues(playlist1)
      expect(values1.activeEvent).toBeTruthy()

      const playlist2 = playlistGenerator({ activeEvent: false })
      const values2 = playlistToDefaultValues(playlist2)
      expect(values2.activeEvent).toBeFalsy()
    })
    it('activeRecipeの確認', () => {
      const playlist1 = playlistGenerator({ activeRecipe: true })
      const values1 = playlistToDefaultValues(playlist1)
      expect(values1.activeRecipe).toBeTruthy()

      const playlist2 = playlistGenerator({ activeRecipe: false })
      const values2 = playlistToDefaultValues(playlist2)
      expect(values2.activeRecipe).toBeFalsy()
    })
    it('activeItemListの確認', () => {
      const playlist1 = playlistGenerator({ activeItemList: true })
      const values1 = playlistToDefaultValues(playlist1)
      expect(values1.activeItemList).toBeTruthy()

      const playlist2 = playlistGenerator({ activeItemList: false })
      const values2 = playlistToDefaultValues(playlist2)
      expect(values2.activeItemList).toBeFalsy()
    })
  })

  describe('episodesToIds', () => {
    it('定義されている場合', () => {
      const episodes = [
        episodeDataGenerator({ id: 1 }),
        episodeDataGenerator({ id: 2 })
      ]
      const episodeIds = episodesToIds(episodes)
      expect(episodeIds).toHaveLength(2)
      expect(episodeIds[0]).toEqual(1)
      expect(episodeIds[1]).toEqual(2)
    })

    it('未定義の場合', () => {
      const episodeIds = episodesToIds(undefined)
      expect(episodeIds).toHaveLength(0)
    })

    it('空配列の場合', () => {
      const episodeIds = episodesToIds([])
      expect(episodeIds).toHaveLength(0)
    })
  })

  // describe('formValuesToCreateParams', () => {
  //   // TODO dirtyをモック化するのが困難なためスキップ（utilsのdirtyValuesの実装の修正が必要かも）
  // })

  // describe('formValuesToUpdateParams', () => {
  //   // TODO dirtyをモック化するのが困難なためスキップ（utilsのdirtyValuesの実装の修正が必要かも）
  // })
}
