import React from 'react'
import { Box, Text, useToast, VStack } from '@chakra-ui/react'

import { SeriesDeck } from '@/types/series_deck'
import { TextCopyBadge } from '@/components/TextCopyBadge'
import ApiStateBadge from '@/components/ApiStateBadge'

type Props = {
  seriesDeck: SeriesDeck
}

export const Info = ({ seriesDeck }: Props) => {
  const toast = useToast()
  const onCopy = () => {
    toast({
      title: 'コピー',
      description: 'IDをコピーしました',
      status: 'info',
      duration: 3000,
      position: 'bottom-right',
      isClosable: true
    })
  }

  return (
    <VStack
      align="flex-start"
      spacing={4}
      borderWidth={1}
      borderRadius="sm"
      m={4}
      p={3}
    >
      <Text fontWeight={700}>{seriesDeck.name}</Text>
      <Box>
        <ApiStateBadge apiState={seriesDeck.apiState} />
        <TextCopyBadge text={seriesDeck.stringId} onCopy={onCopy} />
      </Box>
      {seriesDeck.description && (
        <Box>
          <Text fontWeight={700} fontSize="sm">
            説明
          </Text>
          <Text fontSize="sm">{seriesDeck.description}</Text>
        </Box>
      )}
    </VStack>
  )
}
