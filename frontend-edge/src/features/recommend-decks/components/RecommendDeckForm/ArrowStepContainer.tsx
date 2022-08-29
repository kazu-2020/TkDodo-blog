import { useFormContext } from 'react-hook-form'
import React, { useEffect } from 'react'
import { Box, Hide, HStack } from '@chakra-ui/react'

import { RecommendDeckFormInputs } from '@/features/recommend-decks/types'
import { useRecommendDeckFormStore } from '@/features/recommend-decks/stores/recommendDeckForm'
import { ArrowStepContextProvider, StepItem } from '@/components/ArrowStep'

import { VerticalPreview } from './VerticalPreview'
import { FormHeader } from './FormHeader'
import { EditListTabContent } from './EditListTabContent'
import { EditDeckTabContent } from './EditDeckTabContent'

export const ArrowStepContainer = () => {
  const {
    watch,
    formState: { isDirty, isValid }
  } = useFormContext()

  const hasChangedRecommendPlaylists = useRecommendDeckFormStore(
    (state) => state.hasChangedRecommendPlaylists
  )

  const stepItems: StepItem[] = [
    {
      title: 'リスト(Playlist)',
      isSuccess: hasChangedRecommendPlaylists,
      hasError: false
    },
    {
      title: '基本情報(Deck)',
      isSuccess: isDirty,
      hasError: !isValid
    }
  ]
  const listIndex = 0
  const deckIndex = 1

  const { setInputValues } = useRecommendDeckFormStore((state) => ({
    setInputValues: state.setInputValues
  }))

  useEffect(() => {
    const subscription = watch((value) => {
      setInputValues(value as RecommendDeckFormInputs)
    })
    return () => subscription.unsubscribe()
  }, [watch, setInputValues])

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
