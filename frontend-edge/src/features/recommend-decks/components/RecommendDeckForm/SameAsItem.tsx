import { UseFormRegister } from 'react-hook-form/dist/types/form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import React from 'react'
import { Button, HStack } from '@chakra-ui/react'

import { RecommendDeckFormInputs } from '@/features/recommend-decks/types'
import { PropertyInput } from '@/components/Form'

type Props = {
  register: UseFormRegister<RecommendDeckFormInputs>
  errors: FieldErrors<RecommendDeckFormInputs>
  index: number
  onRemove: (index: number) => void
}

export const SameAsItem = ({ register, errors, index, onRemove }: Props) => (
  <HStack w="100%" mb={2}>
    <PropertyInput
      label="名前"
      error={errors?.deckSameAsAttributes?.[index]?.name}
      register={register(`deckSameAsAttributes.${index}.name`, {
        required: '名前を入力してください'
      })}
      isRequired
      m={3}
    />
    <PropertyInput
      inputType="url"
      label="URL"
      error={errors?.deckSameAsAttributes?.[index]?.url}
      register={register(`deckSameAsAttributes.${index}.url`, {
        required: 'URLを入力してください'
      })}
      isRequired
      m={3}
    />
    <Button
      id={`deckSameAsAttributes.${index}.remove`}
      data-testid={`deckSameAsAttributes.${index}.remove`}
      m={4}
      w={40}
      colorScheme="red"
      onClick={() => onRemove(index)}
    >
      削除
    </Button>
  </HStack>
)
