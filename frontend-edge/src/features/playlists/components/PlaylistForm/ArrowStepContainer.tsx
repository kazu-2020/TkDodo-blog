import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { useFormContext } from 'react-hook-form'
import React, { useEffect } from 'react'
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
    trigger,
    formState: { errors }
  } = useFormContext()

  const stepItems: StepItem[] = [
    {
      title: 'リスト(NItemList)',
      hasError: false
    },
    {
      title: '記事(NArticle)',
      hasError: hasErrorArticle(errors)
    },
    {
      title: '基本情報(NSeries)',
      hasError: hasErrorSeries(errors)
    }
  ]

  useEffect(() => {
    trigger()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  const { describe, it, expect } = import.meta.vitest
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
