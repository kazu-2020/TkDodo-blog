import { useFormContext } from 'react-hook-form'
import React, { useEffect, useMemo } from 'react'
import { Box, Hide, HStack, Show } from '@chakra-ui/react'

import { PlaylistFormInputs } from '@/features/playlists/types'
import { usePlaylistFormStore } from '@/features/playlists/stores/playlistForm'
import { ArrowStepContextProvider, StepItem } from '@/components/ArrowStep'

import { VerticalPreview } from './VerticalPreview'
import { HorizontalPreview } from './HorizontalPreview'
import { FormHeader } from './FormHeader'
import { EditMetaTabContent } from './EditMetaTabContent'
import { EditListTabContent } from './EditListTabContent'
import { EditArticleTabContent } from './EditArticleTabContent'

const listIndex = 0
const articleIndex = 1
const metaIndex = 2

export const ArrowStepContainer = () => {
  const {
    watch,
    formState: { isDirty, isValid }
  } = useFormContext()

  const { hasChangedEpisodes, hasChangedArticle, setInputValues } =
    usePlaylistFormStore((state) => ({
      hasChangedEpisodes: state.hasChangedEpisodes,
      hasChangedArticle: state.hasChangedArticle,
      setInputValues: state.setInputValues
    }))

  const stepItems: StepItem[] = useMemo(
    () => [
      {
        title: 'リスト(NItemList)',
        isSuccess: hasChangedEpisodes,
        hasError: false
      },
      {
        title: '記事(NArticle)',
        isSuccess: hasChangedArticle,
        hasError: false
      },
      {
        title: '基本情報(NSeries)',
        isSuccess: isDirty,
        hasError: !isValid
      }
    ],
    [hasChangedEpisodes, hasChangedArticle, isDirty, isValid]
  )

  useEffect(() => {
    const subscription = watch((value) => {
      setInputValues(value as PlaylistFormInputs)
    })
    return () => subscription.unsubscribe()
  }, [watch])

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
