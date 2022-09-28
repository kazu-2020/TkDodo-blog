import { useFormContext } from 'react-hook-form'
import React from 'react'
import { Box } from '@chakra-ui/react'

import { PlaylistFormInputs } from '@/features/playlists/types'

export const PaletteCard = ({
  color,
  isSelected
}: {
  color: string
  isSelected: boolean
}) => {
  const { setValue } = useFormContext<PlaylistFormInputs>()

  return (
    <Box as="label">
      <Box
        cursor="pointer"
        borderWidth="1px"
        borderRadius="xs"
        boxShadow="lg"
        bgColor={color as string}
        sx={{ ...(isSelected ? { boxShadow: 'outline' } : {}) }}
        px={6}
        py={6}
        onClick={() => {
          setValue('selectedPalette', color, { shouldDirty: true })
        }}
      />
    </Box>
  )
}
