import { Control, UseFormRegister } from 'react-hook-form/dist/types/form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { useFieldArray } from 'react-hook-form'
import React from 'react'
import { Box, Button, VStack } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

import { RecommendDeckFormInputs } from '@/features/recommend-decks/types'
import { PropertyLabel } from '@/components/Form'

import { SameAsItem } from './SameAsItem'

type Props = {
  control: Control<RecommendDeckFormInputs>
  register: UseFormRegister<RecommendDeckFormInputs>
  errors: FieldErrors<RecommendDeckFormInputs>
}

export const SameAsItems = ({ control, register, errors }: Props) => {
  const { fields, append, update, remove } = useFieldArray({
    control,
    // NOTE: keyNameを指定せず、keyにidをそのまま利用するとidにランダムな文字列が設定され更新や削除ができない
    // 次のメジャーバージョンで削除予定らしいので対応が必要になりそう https://react-hook-form.com/api/usefieldarray
    keyName: 'keyId',
    name: 'deckSameAsAttributes'
  })

  return (
    <Box>
      <PropertyLabel label="リンク（同一内容）" schemaName="SameAs" />
      <VStack align="flex-start" my={5}>
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
              name: undefined,
              url: undefined
            })
          }}
        >
          リンク（同一内容）を追加
        </Button>
      </VStack>
    </Box>
  )
}
