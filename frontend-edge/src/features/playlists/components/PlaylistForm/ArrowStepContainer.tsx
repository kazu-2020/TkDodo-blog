import {
  FieldNamesMarkedBoolean,
  FieldValues,
  useFormContext
} from 'react-hook-form'
import React from 'react'
import { Box, Hide, HStack, Show } from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import { ArrowStepContextProvider, StepItem } from '@/components/ArrowStep'

import { VerticalPreview } from './VerticalPreview'
import { EditMetaTabContent } from './MetaTab/EditMetaTabContent'
import { EditListTabContent } from './ListTab/EditListTabContent'
import { HorizontalPreview } from './HorizontalPreview'
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

export const ArrowStepContainer = ({ playlist }: { playlist?: Playlist }) => {
  const {
    formState: { dirtyFields, isValid }
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
      hasError: false
    },
    {
      title: '基本情報(NSeries)',
      isSuccess: hasChangedSeries(dirtyFields),
      hasError: !isValid
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
          <EditListTabContent playlist={playlist} contentIndex={listIndex} />
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
