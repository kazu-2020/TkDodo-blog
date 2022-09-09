import React from 'react'
import { Box, HStack, Text } from '@chakra-ui/react'

export const AdjustedColorCard = ({
  color,
  label
}: {
  color: string
  label: string
}) => (
  <Box>
    <Text fontSize="xs" fontWeight="bold" mb={1}>
      {label}
    </Text>

    <HStack spacing={4}>
      <Text>{color}</Text>
      <Box bgColor={color} w={7} h={7} boxShadow="md" />
    </HStack>
  </Box>
)
