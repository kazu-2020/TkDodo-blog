import React from 'react'
import { Box, Text, useToast, VStack } from '@chakra-ui/react'

import { RecommendDeck } from '@/types/recommend_deck'
import { TextCopyBadge } from '@/components/TextCopyBadge'
import ApiStateBadge from '@/components/ApiStateBadge'

type Props = {
  recommendDeck: RecommendDeck
}

export const Info = ({ recommendDeck }: Props) => {
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
      <Text fontWeight={700}>{recommendDeck.name}</Text>
      <Box>
        <ApiStateBadge apiState={recommendDeck.apiState} />
        <TextCopyBadge text={recommendDeck.stringId} onCopy={onCopy} />
      </Box>
      {recommendDeck.description && (
        <Box>
          <Text fontWeight={700} fontSize="sm">
            説明
          </Text>
          <Text fontSize="sm">{recommendDeck.description}</Text>
        </Box>
      )}
    </VStack>
  )
}
