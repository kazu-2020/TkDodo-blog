import { FieldErrors } from 'react-hook-form/dist/types/errors'
import {
  FieldNamesMarkedBoolean,
  FieldValues,
  useFormContext
} from 'react-hook-form'
import React from 'react'
import { Box, Hide, HStack, Show } from '@chakra-ui/react'

import {
  HorizontalPreview,
  VerticalPreview
} from '@/features/playlists/components/PlaylistForm/Preview'
import { ArrowStepContextProvider, StepItem } from '@/components/ArrowStep'

import { EditMetaTabContent } from './MetaTab/EditMetaTabContent'
import { EditListTabContent } from './ListTab/EditListTabContent'
import { FormHeader } from './FormHeader'
import { EditArticleTabContent } from './ArticleTab/EditArticleTabContent'

const listIndex = 0
const articleIndex = 1
const metaIndex = 2

const hasChangedEpisodes = (
  dirtyFields: FieldNamesMarkedBoolean<FieldValues>
): boolean => dirtyFields.episodes === true

const hasChangedArticle = (
  dirtyFields: FieldNamesMarkedBoolean<FieldValues>
): boolean =>
  dirtyFields.editorData === true ||
  dirtyFields.markedHeader === true ||
  dirtyFields.markedFooter === true ||
  dirtyFields.authorType === true ||
  dirtyFields.authorName === true ||
  dirtyFields.publisherType === true ||
  dirtyFields.publisherName === true

const hasChangedSeries = (
  dirtyFields: FieldNamesMarkedBoolean<FieldValues>
): boolean =>
  dirtyFields.name === true ||
  dirtyFields.detailedNameRuby === true ||
  dirtyFields.detailedCatch === true ||
  dirtyFields.description === true ||
  dirtyFields.keywords?.some(
    (keyword: any) => keyword.label === true || keyword.value === true
  ) ||
  dirtyFields.hashtags?.some(
    (hashtag: any) => hashtag.label === true || hashtag.value === true
  ) ||
  dirtyFields.formatGenreCode === true ||
  dirtyFields.themeGenreCode === true ||
  dirtyFields.selectedPalette === true ||
  dirtyFields.primaryLightColor === true ||
  dirtyFields.primaryDarkColor === true ||
  dirtyFields.linkLightColor === true ||
  dirtyFields.linkDarkColor === true ||
  dirtyFields.aliasId === true ||
  dirtyFields.sameAsAttributes?.some(
    (sameAs: any) =>
      Object.keys(sameAs).length === 0 ||
      sameAs.name === true ||
      sameAs.url === true ||
      // eslint-disable-next-line no-underscore-dangle
      sameAs._destroy === true
  ) ||
  dirtyFields.citationsAttributes?.some(
    (citation: any) =>
      Object.keys(citation).length === 0 ||
      citation.name === true ||
      citation.url === true ||
      // eslint-disable-next-line no-underscore-dangle
      citation._destroy === true
  ) ||
  dirtyFields.apiState === true ||
  dirtyFields.logoImageSrc === true ||
  dirtyFields.eyecatchImageSrc === true ||
  dirtyFields.heroImageSrc === true ||
  dirtyFields.activeTvepisode === true ||
  dirtyFields.activeArticle === true ||
  dirtyFields.activeFaqpage === true ||
  dirtyFields.activeHowto === true ||
  dirtyFields.activeEvent === true ||
  dirtyFields.activeRecipe === true ||
  dirtyFields.activeItemList === true

const hasErrorArticle = (errors: FieldErrors): boolean =>
  !!(
    errors.editorData ||
    errors.markedHeader ||
    errors.markedFooter ||
    errors.authorType ||
    errors.authorName ||
    errors.publisherType ||
    errors.publisherName
  )

const hasErrorSeries = (errors: FieldErrors): boolean => {
  const {
    episodes,
    editorData,
    markedHeader,
    markedFooter,
    authorType,
    authorName,
    publisherType,
    publisherName,
    ...fields
  } = errors

  return Object.keys(fields).length > 0
}

export const ArrowStepContainer = () => {
  const {
    formState: { dirtyFields, errors }
  } = useFormContext()

  const stepItems: StepItem[] = [
    {
      title: 'リスト(NItemList)',
      isSuccess: hasChangedEpisodes(dirtyFields),
      hasError: false
    },
    {
      title: '記事(NArticle)',
      isSuccess: hasChangedArticle(dirtyFields),
      hasError: hasErrorArticle(errors)
    },
    {
      title: '基本情報(NSeries)',
      isSuccess: hasChangedSeries(dirtyFields),
      hasError: hasErrorSeries(errors)
    }
  ]

  return (
    <ArrowStepContextProvider>
      <FormHeader stepItems={stepItems} />

      <Show below="lg">
        <HorizontalPreview />
      </Show>

      <HStack spacing="4" alignItems="start">
        <Box bg="white" p={5} borderRadius="sm" minH="400px" flex={1}>
          <EditListTabContent contentIndex={listIndex} />
          <EditArticleTabContent contentIndex={articleIndex} />
          <EditMetaTabContent contentIndex={metaIndex} />
        </Box>
        <Hide below="lg">
          <VerticalPreview />
        </Hide>
      </HStack>
    </ArrowStepContextProvider>
  )
}

if (import.meta.vitest) {
  const { generatePlaylistDirtyFields } = await import('@/test/data-generators')

  const { describe, it, expect } = import.meta.vitest
  describe('hasChangedEpisodes', () => {
    it('変更がある場合', () => {
      const dirtyFields = generatePlaylistDirtyFields({ episodes: true })
      expect(hasChangedEpisodes(dirtyFields)).toBe(true)
    })

    it('変更がない場合（ステータスあり）', () => {
      const dirtyFields = generatePlaylistDirtyFields({})
      expect(hasChangedEpisodes(dirtyFields)).toBe(false)
    })

    it('変更がない場合（ステータスなし）', () => {
      const dirtyFields = {}
      expect(hasChangedEpisodes(dirtyFields)).toBe(false)
    })
  })

  describe('hasChangedArticle', () => {
    it('変更がある場合', () => {
      const dirtyFields = generatePlaylistDirtyFields({ editorData: true })
      expect(hasChangedArticle(dirtyFields)).toBe(true)
    })

    it('変更がない場合（ステータスあり）', () => {
      const dirtyFields = generatePlaylistDirtyFields({})
      expect(hasChangedArticle(dirtyFields)).toBe(false)
    })

    it('変更がない場合（ステータスなし）', () => {
      const dirtyFields = {}
      expect(hasChangedArticle(dirtyFields)).toBe(false)
    })
  })

  // eslint-disable-next-line max-statements,max-lines-per-function
  describe('hasChangedSeries', () => {
    it('変更がある場合', () => {
      const dirtyFields = generatePlaylistDirtyFields({ name: true })
      expect(hasChangedSeries(dirtyFields)).toBe(true)
    })

    it('変更がある場合（keyword）', () => {
      const dirtyFields1 = generatePlaylistDirtyFields({
        keywords: [{ label: true, value: false }]
      })
      expect(hasChangedSeries(dirtyFields1)).toBe(true)

      const dirtyFields2 = generatePlaylistDirtyFields({
        keywords: [
          { label: false, value: false },
          { label: true, value: false }
        ]
      })
      expect(hasChangedSeries(dirtyFields2)).toBe(true)
    })

    it('変更がある場合（hashtag）', () => {
      const dirtyFields1 = generatePlaylistDirtyFields({
        hashtags: [{ label: true, value: false }]
      })
      expect(hasChangedSeries(dirtyFields1)).toBe(true)

      const dirtyFields2 = generatePlaylistDirtyFields({
        hashtags: [
          { label: false, value: false },
          { label: true, value: false }
        ]
      })
      expect(hasChangedSeries(dirtyFields2)).toBe(true)
    })

    it('変更がある場合（sameAs）', () => {
      const dirtyFields1 = generatePlaylistDirtyFields({
        sameAsAttributes: [{ name: false, url: false, _destroy: true }]
      })
      expect(hasChangedSeries(dirtyFields1)).toBe(true)

      const dirtyFields2 = generatePlaylistDirtyFields({
        sameAsAttributes: [
          { name: false, url: false, _destroy: false },
          { name: false, url: false, _destroy: true }
        ]
      })
      expect(hasChangedSeries(dirtyFields2)).toBe(true)

      const dirtyFields3 = generatePlaylistDirtyFields({
        sameAsAttributes: [
          { name: false, url: false, _destroy: false },
          { name: false, url: false, _destroy: false },
          {} // 新規追加した場合は、空のオブジェクトが生成される
        ]
      })
      expect(hasChangedSeries(dirtyFields3)).toBe(true)
    })

    it('変更がある場合（citations）', () => {
      const dirtyFields1 = generatePlaylistDirtyFields({
        citationsAttributes: [{ name: false, url: false, _destroy: true }]
      })
      expect(hasChangedSeries(dirtyFields1)).toBe(true)

      const dirtyFields2 = generatePlaylistDirtyFields({
        citationsAttributes: [
          { name: false, url: false, _destroy: false },
          { name: false, url: false, _destroy: true }
        ]
      })
      expect(hasChangedSeries(dirtyFields2)).toBe(true)

      const dirtyFields3 = generatePlaylistDirtyFields({
        citationsAttributes: [
          { name: false, url: false, _destroy: false },
          { name: false, url: false, _destroy: false },
          {} // 新規追加した場合は、空のオブジェクトが生成される
        ]
      })
      expect(hasChangedSeries(dirtyFields3)).toBe(true)
    })

    it('変更がない場合（ステータスあり）', () => {
      const dirtyFields = generatePlaylistDirtyFields({})
      expect(hasChangedSeries(dirtyFields)).toBe(false)
    })

    it('変更がない場合（ステータスなし）', () => {
      const dirtyFields = {}
      expect(hasChangedSeries(dirtyFields)).toBe(false)
    })

    it('変更がない場合（keyword）', () => {
      const dirtyFields1 = generatePlaylistDirtyFields({ keywords: [] })
      expect(hasChangedSeries(dirtyFields1)).toBe(false)

      const dirtyFields2 = generatePlaylistDirtyFields({
        keywords: [
          { label: false, value: false },
          { label: false, value: false }
        ]
      })
      expect(hasChangedSeries(dirtyFields2)).toBe(false)
    })

    it('変更がない場合（hashtag）', () => {
      const dirtyFields1 = generatePlaylistDirtyFields({ hashtags: [] })
      expect(hasChangedSeries(dirtyFields1)).toBe(false)

      const dirtyFields2 = generatePlaylistDirtyFields({
        hashtags: [
          { label: false, value: false },
          { label: false, value: false }
        ]
      })
      expect(hasChangedSeries(dirtyFields2)).toBe(false)
    })

    it('変更がない場合（sameAs）', () => {
      const dirtyFields1 = generatePlaylistDirtyFields({ sameAsAttributes: [] })
      expect(hasChangedSeries(dirtyFields1)).toBe(false)

      const dirtyFields2 = generatePlaylistDirtyFields({
        sameAsAttributes: [
          { name: false, url: false, _destroy: false },
          { name: false, url: false, _destroy: false }
        ]
      })
      expect(hasChangedSeries(dirtyFields2)).toBe(false)
    })

    it('変更がない場合（citations）', () => {
      const dirtyFields1 = generatePlaylistDirtyFields({
        citationsAttributes: []
      })
      expect(hasChangedSeries(dirtyFields1)).toBe(false)

      const dirtyFields2 = generatePlaylistDirtyFields({
        citationsAttributes: [
          { name: false, url: false, _destroy: false },
          { name: false, url: false, _destroy: false }
        ]
      })
      expect(hasChangedSeries(dirtyFields2)).toBe(false)
    })
  })

  describe('hasErrorArticle', () => {
    it('エラーがある場合', () => {
      const errors = { editorData: {} }
      expect(hasErrorArticle(errors)).toBe(true)
    })

    it('他のタブにエラーがある場合', () => {
      const errors = { name: {} }
      expect(hasErrorArticle(errors)).toBe(false)
    })

    it('エラーがない場合', () => {
      const errors = {}
      expect(hasErrorArticle(errors)).toBe(false)
    })
  })

  describe('hasErrorSeries', () => {
    it('エラーがある場合', () => {
      const errors = { name: {} }
      expect(hasErrorSeries(errors)).toBe(true)
    })

    it('他のタブにエラーがある場合', () => {
      const errors = { editorData: {} }
      expect(hasErrorSeries(errors)).toBe(false)
    })

    it('エラーがない場合', () => {
      const errors = {}
      expect(hasErrorSeries(errors)).toBe(false)
    })
  })
}
