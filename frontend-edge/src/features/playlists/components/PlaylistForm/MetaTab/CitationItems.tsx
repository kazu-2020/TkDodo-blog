import { Control, UseFormRegister } from 'react-hook-form/dist/types/form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { useFieldArray } from 'react-hook-form'
import React from 'react'
import { Box, Button, VStack } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

import { PlaylistFormInputs } from '@/features/playlists/types'
import { PropertyLabel } from '@/components/Form'

import { CitationItem } from './CitationItem'

type Props = {
  control: Control<PlaylistFormInputs>
  register: UseFormRegister<PlaylistFormInputs>
  errors: FieldErrors<PlaylistFormInputs>
}

export const CitationItems = ({ control, register, errors }: Props) => {
  const { fields, append, update, remove } = useFieldArray({
    control,
    // NOTE: keyNameを指定せず、keyにidをそのまま利用するとidにランダムな文字列が設定され更新や削除ができない
    // 次のメジャーバージョンで削除予定らしいので対応が必要になりそう https://react-hook-form.com/api/usefieldarray
    keyName: 'keyId',
    name: 'citationsAttributes'
  })

  return (
    <Box>
      <PropertyLabel label="関連リンク" schemaName="Citation" />
      <VStack align="flex-start" my={5}>
        {fields.map(
          (field, index) =>
            // eslint-disable-next-line no-underscore-dangle
            !field._destroy && (
              <CitationItem
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
          関連リンクを追加
        </Button>
      </VStack>
    </Box>
  )
}
