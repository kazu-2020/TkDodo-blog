import { Control, UseFormRegister } from 'react-hook-form/dist/types/form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { useFieldArray } from 'react-hook-form'
import React from 'react'
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

import { PlaylistFormInputs } from '@/features/playlists/types'

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
      <HStack>
        <Text fontSize="lg" fontWeight="bold">
          関連リンク -
        </Text>
        <Text fontSize="md" fontWeight="normal" color="rgba(0, 0, 0, 0.6)">
          Citation
        </Text>
      </HStack>
      <VStack align="flex-start" mb={5} mt={5}>
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
              name: '',
              url: ''
            })
          }}
        >
          関連リンクを追加
        </Button>
      </VStack>
    </Box>
  )
}
