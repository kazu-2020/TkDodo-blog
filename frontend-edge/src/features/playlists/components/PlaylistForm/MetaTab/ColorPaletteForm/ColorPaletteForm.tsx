import { UseFormSetValue } from 'react-hook-form/dist/types/form'
import { useFormContext, useWatch } from 'react-hook-form'
import React, { useEffect } from 'react'
import { Box, Flex, HStack } from '@chakra-ui/react'

import {
  adjustLinkDarkColor,
  adjustLinkLightColor,
  adjustPrimaryDarkColor,
  adjustPrimaryLightColor,
  PALETTE_BASE_COLORS
} from '@/features/playlists/utils/adjustColor'
import { PlaylistFormInputs } from '@/features/playlists/types'
import { PaletteCard } from '@/features/playlists/components/PlaylistForm/MetaTab/ColorPaletteForm/PaletteCard'
import { ColorPickerCard } from '@/features/playlists/components/PlaylistForm/MetaTab/ColorPaletteForm/ColorPickerCard'
import { AdjustedColorCard } from '@/features/playlists/components/PlaylistForm/MetaTab/ColorPaletteForm/AdjustedColorCard'

const setAdjustColors = (colorHex: string, setValue: UseFormSetValue<any>) => {
  setValue('selectedPalette', colorHex)
  setValue('primaryLightColor', adjustPrimaryLightColor(colorHex))
  setValue('primaryDarkColor', adjustPrimaryDarkColor(colorHex))
  setValue('linkLightColor', adjustLinkLightColor(colorHex))
  setValue('linkDarkColor', adjustLinkDarkColor(colorHex))
}

const isSelectedFreePalette = (colorHex: string) =>
  !PALETTE_BASE_COLORS.includes(colorHex)

const colorPickerInitialColor = (selectedPalette: string) =>
  isSelectedFreePalette(selectedPalette) ? selectedPalette : '#000000'

export const ColorPaletteForm = () => {
  const { register, setValue } = useFormContext<PlaylistFormInputs>()
  const [
    selectedPalette,
    primaryLightColor,
    primaryDarkColor,
    linkDarkColor,
    linkLightColor
  ] = useWatch({
    name: [
      'selectedPalette',
      'primaryLightColor',
      'primaryDarkColor',
      'linkDarkColor',
      'linkLightColor'
    ]
  })

  useEffect(() => {
    setAdjustColors(selectedPalette, setValue)
  }, [selectedPalette])

  return (
    <Box w={600}>
      <input type="hidden" {...register('selectedPalette')} />
      <input type="hidden" {...register('primaryLightColor')} />
      <input type="hidden" {...register('primaryDarkColor')} />
      <input type="hidden" {...register('linkLightColor')} />
      <input type="hidden" {...register('linkDarkColor')} />
      <HStack mb={4}>
        {PALETTE_BASE_COLORS.map((value) => (
          <PaletteCard
            key={value}
            color={value}
            isSelected={value === selectedPalette}
          />
        ))}
        <ColorPickerCard
          initialColor={colorPickerInitialColor(selectedPalette)}
          isSelected={isSelectedFreePalette(selectedPalette)}
        />
      </HStack>
      <Flex justifyContent="space-between" w="100%">
        <AdjustedColorCard color={primaryLightColor} label="primaryLight" />
        <AdjustedColorCard color={primaryDarkColor} label="primaryDark" />
        <AdjustedColorCard color={linkLightColor} label="linkLight" />
        <AdjustedColorCard color={linkDarkColor} label="linkDark" />
      </Flex>
    </Box>
  )
}
