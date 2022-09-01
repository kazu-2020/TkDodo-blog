import { useFormContext } from 'react-hook-form'
import React, { Dispatch } from 'react'
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  StyleProps
} from '@chakra-ui/react'

import { dummyImageUrl } from '@/utils/image'
import { PlaylistFormInputs } from '@/features/playlists/types'
import { PlaylistImageFormItemImage } from '@/features/playlists/components/PlaylistForm/MetaTab/CropperImageModal/PlaylistImageFormItemImage'

export const PlaylistImageFormItem = ({
  imageType,
  label,
  onOpen,
  setImageType,
  width,
  height,
  ...props
}: {
  imageType: 'logo' | 'eyecatch' | 'hero'
  label: string
  onOpen: () => void
  setImageType: Dispatch<any>
  width: string | number
  height: string | number
} & StyleProps) => {
  const {
    getValues,
    setValue,
    register,
    formState: { errors }
  } = useFormContext<PlaylistFormInputs>()
  const name:
    | 'logoImageSrc'
    | 'eyecatchImageSrc'
    | 'heroImageSrc' = `${imageType}ImageSrc`
  const error = errors[name]

  return (
    <FormControl
      id={name}
      isInvalid={!!error}
      isRequired
      sx={{
        'label[data-invalid]': {
          color: 'red.500'
        }
      }}
      w={width}
      {...props}
    >
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <PlaylistImageFormItemImage
        src={getValues(name)}
        htmlWidth={width}
        htmlHeight={height}
        boxShadow="md"
        fallbackSrc={dummyImageUrl('', imageType)}
        onEdit={() => {
          setImageType(imageType)
          onOpen()
        }}
        onRemove={() => {
          setValue(name, '')
        }}
      />
      <input
        type="hidden"
        {...register(name, {
          required: '画像を設定してください'
        })}
      />
      {error ? (
        <FormErrorMessage fontSize="xs">{error.message}</FormErrorMessage>
      ) : (
        <Box h={26} />
      )}
    </FormControl>
  )
}
