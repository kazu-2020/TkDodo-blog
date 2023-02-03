import { useFormContext } from 'react-hook-form'
import React, { useEffect } from 'react'
import { Box, Hide, HStack } from '@chakra-ui/react'

import { ArrowStepContextProvider, StepItem } from '@/components/ArrowStep'

import { VerticalPreview } from './VerticalPreview'
import { FormHeader } from './FormHeader'
import { EditListTabContent } from './EditListTabContent'
import { EditDeckTabContent } from './EditDeckTabContent'

export const ArrowStepContainer = () => {
  const {
    trigger,
    formState: { isValid }
  } = useFormContext()

  const stepItems: StepItem[] = [
    {
      title: 'リスト(Playlist)',
      hasError: false
    },
    {
      title: '基本情報(Deck)',
      hasError: !isValid
    }
  ]
  const listIndex = 0
  const deckIndex = 1

  useEffect(() => {
    trigger()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
