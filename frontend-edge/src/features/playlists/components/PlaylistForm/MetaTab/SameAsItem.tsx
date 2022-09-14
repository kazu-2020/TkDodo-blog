import { UseFormRegister } from 'react-hook-form/dist/types/form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import React from 'react'
import { Button, HStack } from '@chakra-ui/react'

import { PlaylistFormInputs } from '@/features/playlists/types'
import { FloatingLabelInput } from '@/components/Form/FloatingLable'

type Props = {
  register: UseFormRegister<PlaylistFormInputs>
  errors: FieldErrors<PlaylistFormInputs>
  index: number
  onRemove: (index: number) => void
}

export const SameAsItem = ({ register, errors, index, onRemove }: Props) => (
  <HStack w="100%" mb={2}>
    <FloatingLabelInput
      id={`sameAsAttributes.${index}.name`}
      label="名前"
      error={errors?.name}
      register={register(`sameAsAttributes.${index}.name`, {
        required: '名前を入力してください'
      })}
      isRequired
      m={3}
    />
    <FloatingLabelInput
      id={`sameAsAttributes.${index}.url`}
      label="URL"
      error={errors?.name}
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
