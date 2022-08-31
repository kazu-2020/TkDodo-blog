import { useFormContext } from 'react-hook-form'
import React from 'react'
import { Checkbox, FormControl } from '@chakra-ui/react'

import { PlaylistFormInputs } from '@/features/playlists/types'
import {
  FloatingLabelTextarea,
  FloatingLabelInput
} from '@/components/Form/FloatingLable'
import { ArrowStepContent } from '@/components/ArrowStep'

export const EditMetaTabContent = ({
  contentIndex
}: {
  contentIndex: number
}) => {
  const {
    register,
    formState: { errors }
  } = useFormContext<PlaylistFormInputs>()

  return (
    <ArrowStepContent index={contentIndex}>
      <FloatingLabelInput
        id="name"
        label="名前 - Name"
        error={errors?.name}
        register={register('name', {
          required: '名前を入力してください'
        })}
        isRequired
        mb={10}
      />

      <FloatingLabelInput
        id="detailedNameRuby"
        label="ふりがな - Detailed Name Ruby"
        error={errors?.detailedNameRuby}
        register={register('detailedNameRuby')}
        mb={5}
      />

      <FloatingLabelTextarea
        id="detailedCatch"
        label="キャッチコピー - DetailedCatch"
        error={errors?.detailedCatch}
        register={register('detailedCatch')}
        mb={5}
      />

      <FloatingLabelTextarea
        id="description"
        label="説明 - Description"
        error={errors?.description}
        register={register('description')}
        mb={5}
      />

      <FloatingLabelInput
        id="keywords"
        label="キーワード - Keywords"
        error={errors?.keywords}
        register={register('keywords')}
        mb={5}
      />

      <FloatingLabelInput
        id="hashtags"
        label="ハッシュタグ - Hashtags"
        error={errors?.hashtags}
        register={register('hashtags')}
        mb={5}
      />

      <FormControl mb={5}>
        <Checkbox
          id="apiState"
          data-testid="apiState"
          {...register('apiState')}
        >
          APIへ公開する
        </Checkbox>
      </FormControl>
    </ArrowStepContent>
  )
}
