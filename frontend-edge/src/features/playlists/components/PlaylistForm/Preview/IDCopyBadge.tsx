import React from 'react'
import { useToast } from '@chakra-ui/react'

import { TextCopyBadge } from '@/components/TextCopyBadge'

export const IDCopyBadge = ({ id }: { id: string | undefined }) => {
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

  if (id === undefined) {
    return null
  }

  return (
    <TextCopyBadge
      w="100%"
      noOfLines={1}
      m={0}
      prefix="Id"
      text={id}
      onCopy={onCopy}
    />
  )
}
