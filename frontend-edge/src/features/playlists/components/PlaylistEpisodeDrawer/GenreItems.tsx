import React from 'react'
import { HStack, Text } from '@chakra-ui/react'

import { FormatType, ThemeType } from '@/types/episode_data'

type Props = {
  items: FormatType[] | ThemeType[]
  borderColor: string
  backgroundColor: string
  isRadius: boolean
}
export const GenreItems = ({
  items,
  borderColor,
  backgroundColor,
  isRadius
}: Props) => (
  <HStack alignItems="flex-start" p={0} m={0} h="21px">
    {items.map((item) => (
      <Text
        fontSize="10px"
        fontWeight="bold"
        key={item.id}
        border="2px"
        borderColor={borderColor}
        borderRadius={isRadius ? '15px' : '0'}
        px="5px"
        py="1px"
        mr="6px"
        backgroundColor={backgroundColor}
      >
        {item.name}
      </Text>
    ))}
    {items.length <= 0 && <Text fontSize="10px">-</Text>}
  </HStack>
)
