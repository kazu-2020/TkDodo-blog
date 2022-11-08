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
): boolean => !!dirtyFields.episodes

const hasChangedArticle = (
  dirtyFields: FieldNamesMarkedBoolean<FieldValues>
): boolean =>
  dirtyFields.editorData ||
  dirtyFields.markedHeader ||
  dirtyFields.markedFooter ||
  dirtyFields.authorType ||
  dirtyFields.authorName ||
  dirtyFields.publisherType ||
  dirtyFields.publisherName

const hasChangedSeries = (
  dirtyFields: FieldNamesMarkedBoolean<FieldValues>
): boolean => {
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
  } = dirtyFields

  return Object.keys(fields).length > 0
}

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
