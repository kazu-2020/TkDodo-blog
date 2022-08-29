import { Control, UseFormRegister } from 'react-hook-form/dist/types/form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { useFieldArray } from 'react-hook-form'
import React from 'react'
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

import { RecommendDeckFormInputs } from '@/features/recommend-decks/types'
import { SameAsItem } from '@/features/recommend-decks/components/RecommendDeckForm/SameAsItem'

type Props = {
  control: Control<RecommendDeckFormInputs>
  register: UseFormRegister<RecommendDeckFormInputs>
  errors: FieldErrors<RecommendDeckFormInputs>
}

export const SameAsItems = ({ control, register, errors }: Props) => {
  const { fields, append, update, remove } = useFieldArray({
    control,
    keyName: 'keyId',
    name: 'deckSameAsAttributes'
  })

  return (
    <Box>
      <HStack>
        <Text fontSize="lg" fontWeight="bold">
          リンク（同一内容）-
        </Text>
        <Text fontSize="md" fontWeight="normal" color="rgba(0, 0, 0, 0.6)">
          SameAs
        </Text>
      </HStack>
      <VStack align="flex-start" mb={5} mt={5}>
        {fields.map(
          (field, index) =>
            // eslint-disable-next-line no-underscore-dangle
            !field._destroy && (
              <SameAsItem
                key={field.keyId}
                register={register}
                errors={errors}
                index={index}
                onRemove={(removeIndex) => {
                  if (fields[removeIndex].id) {
                    update(removeIndex, { ...fields[removeIndex], _destroy: 1 })
                  } else {
                    remove(removeIndex)
                  }
                }}
              />
            )
        )}
        <Button
          leftIcon={<AddIcon />}
          onClick={() => {
            append({
              name: '',
              url: ''
            })
          }}
        >
          リンク（同一内容）を追加
        </Button>
      </VStack>
    </Box>
  )
}
