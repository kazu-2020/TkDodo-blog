import {
  FieldNamesMarkedBoolean,
  FieldValues,
  useFormContext
} from 'react-hook-form'
import React from 'react'
import { Box, Hide, HStack } from '@chakra-ui/react'

import { ArrowStepContextProvider, StepItem } from '@/components/ArrowStep'

import { VerticalPreview } from './VerticalPreview'
import { FormHeader } from './FormHeader'
import { EditListTabContent } from './EditListTabContent'
import { EditDeckTabContent } from './EditDeckTabContent'

const hasChangedPlaylists = (
  dirtyFields: FieldNamesMarkedBoolean<FieldValues>
): boolean => !!dirtyFields.playlists

const hasChangedDeck = (
  dirtyFields: FieldNamesMarkedBoolean<FieldValues>
): boolean => {
  const { playlists, ...fields } = dirtyFields

  return Object.keys(fields).length > 0
}

export const ArrowStepContainer = () => {
  const {
    formState: { dirtyFields, isValid }
  } = useFormContext()

  const stepItems: StepItem[] = [
    {
      title: 'リスト(Playlist)',
      isSuccess: hasChangedPlaylists(dirtyFields),
      hasError: false
    },
    {
      title: '基本情報(Deck)',
      isSuccess: hasChangedDeck(dirtyFields),
      hasError: !isValid
    }
  ]
  const listIndex = 0
  const deckIndex = 1

  return (
    <ArrowStepContextProvider>
      <FormHeader stepItems={stepItems} />

      <HStack spacing="4" alignItems="start">
        <Box bg="white" p={5} borderRadius="sm" minH="400px" flex={1}>
          <EditListTabContent contentIndex={listIndex} />
          <EditDeckTabContent contentIndex={deckIndex} />
        </Box>
        <Hide below="lg">
          <VerticalPreview />
        </Hide>
      </HStack>
    </ArrowStepContextProvider>
  )
}
