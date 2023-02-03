import { UseFormRegister } from 'react-hook-form/dist/types/form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import React from 'react'
import { Button, HStack } from '@chakra-ui/react'

import { PlaylistFormInputs } from '@/features/playlists/types'
import { PropertyInput } from '@/components/Form'

type Props = {
  register: UseFormRegister<PlaylistFormInputs>
  errors: FieldErrors<PlaylistFormInputs>
  index: number
  onRemove: (index: number) => void
}

export const SameAsItem = ({ register, errors, index, onRemove }: Props) => (
  <HStack w="100%" mb={2}>
    <PropertyInput
      label="名前"
      error={errors?.sameAsAttributes?.[index]?.name}
      register={register(`sameAsAttributes.${index}.name`, {
        required: '名前を入力してください'
      })}
      isRequired
      m={3}
    />
    <PropertyInput
      inputType="url"
      label="URL"
      error={errors?.sameAsAttributes?.[index]?.url}
      register={register(`sameAsAttributes.${index}.url`, {
        required: 'URLを入力してください'
      })}
      isRequired
      m={3}
    />
    <Button m={4} w={40} colorScheme="red" onClick={() => onRemove(index)}>
      削除
    </Button>
  </HStack>
)
