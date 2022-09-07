import { useWatch } from 'react-hook-form'
import React from 'react'
import { Box, Heading, Text } from '@chakra-ui/react'

// TODO: 実装する
export const VerticalPreview = () => {
  const [name, description] = useWatch({ name: ['name', 'description'] })

  return (
    <Box w="300px" bg="white" minH="400px" p={2}>
      <p>プレビュー</p>
      <Heading>{name}</Heading>
      <Text>{description}</Text>
    </Box>
  )
}
