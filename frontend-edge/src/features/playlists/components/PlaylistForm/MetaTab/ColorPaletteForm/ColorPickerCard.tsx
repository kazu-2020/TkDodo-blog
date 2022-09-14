import { MdPalette } from 'react-icons/all'
import { useFormContext } from 'react-hook-form'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import React, { Dispatch, useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  useDisclosure
} from '@chakra-ui/react'

import { PlaylistFormInputs } from '@/features/playlists/types'

const ColorPicker = ({
  onCancel,
  color,
  setColor
}: {
  onCancel: () => void
  color: string
  setColor: Dispatch<any>
}) => (
  <Stack spacing={4}>
    <HexColorPicker color={color} onChange={setColor} />
    <HexColorInput
      prefixed
      color={color}
      onChange={setColor}
      style={{
        fontSize: '1rem',
        padding: '0.5rem',
        border: '1px solid #ccc',
        borderRadius: '6px'
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onCancel()
        }
      }}
    />
  </Stack>
)
export const ColorPickerCard = ({
  initialColor = '#000000',
  isSelected
}: {
  initialColor: string
  isSelected: boolean
}) => {
  const [color, setColor] = useState(initialColor)
  const { onOpen, onClose, isOpen } = useDisclosure()

  const { setValue } = useFormContext<PlaylistFormInputs>()

  useEffect(() => {
    setValue('selectedPalette', color)
  }, [color])

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="right"
      size="xs"
    >
      <PopoverTrigger>
        <Box as="label">
          <Flex
            cursor="pointer"
            borderWidth="1px"
            borderRadius="xs"
            boxShadow="lg"
            bgColor={color as string}
            sx={{ ...(isSelected ? { boxShadow: 'outline' } : {}) }}
            px={6}
            onClick={() => {
              onOpen()
            }}
            p={3}
            justifyContent="center"
            alignItems="center"
          >
            <Icon as={MdPalette} w={6} h={6} color="white" />
          </Flex>
        </Box>
      </PopoverTrigger>
      <PopoverContent w="225px">
        <PopoverBody>
          <ColorPicker onCancel={onClose} color={color} setColor={setColor} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
